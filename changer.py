import os
import requests
import logging
import argparse
import subprocess
import threading
import signal
from time import sleep
from tenacity import retry, stop_after_attempt, wait_fixed
from dotenv import load_dotenv


load_dotenv()


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),  
        logging.FileHandler("tor_ip_changer.log")  
    ]
)


PROXIES = {
    'http': 'socks5h://127.0.0.1:9050',
    'https': 'socks5h://127.0.0.1:9050'
}
URL = "https://httpbin.org/ip"


stop_signal = False


def check_tor_status():
    """Verifica se o serviço Tor está rodando antes de iniciar."""
    try:
        subprocess.run(["systemctl", "is-active", "--quiet", "tor"], check=True)
        logging.info(" O serviço Tor está ativo.")
    except subprocess.CalledProcessError:
        logging.error(" O serviço Tor NÃO está rodando! Inicie-o antes de executar o programa.")
        exit(1)


def restart_tor():
    """Reinicia o serviço Tor em uma thread separada para não travar a execução."""
    def tor_worker():
        logging.info(" Reiniciando o serviço Tor...")
        try:
            subprocess.run(["systemctl", "restart", "tor"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            logging.info(" Tor reiniciado com sucesso.")
        except subprocess.CalledProcessError as e:
            logging.error(f" Erro ao reiniciar o Tor: {e}")

    threading.Thread(target=tor_worker, daemon=True).start()


@retry(stop=stop_after_attempt(3), wait=wait_fixed(5))
def get_ip(session):
    """Obtém o IP atual pela rede Tor, com retry automático em caso de falha."""
    try:
        response = session.get(URL, proxies=PROXIES, timeout=10)
        response.raise_for_status()  
        ip = response.json().get("origin", "Desconhecido")
        logging.info(f" Seu IP atual: {ip}")
    except requests.RequestException as e:
        logging.warning(f" Erro ao obter IP (tentando novamente...): {e}")
        raise


def handle_exit(signum, frame):
    """Trata sinais de encerramento para desligar o script de forma segura."""
    global stop_signal
    logging.info(" Interrupção detectada! Encerrando o script com segurança...")
    stop_signal = True


def main(interval):
    """Loop principal para alternar o IP periodicamente."""
    check_tor_status()

    logging.info(f" Iniciando monitoramento... IP será trocado a cada {interval} segundos.")

    with requests.Session() as session:
        while not stop_signal:
            get_ip(session)
            sleep(interval)
            restart_tor()

    logging.info(" Script finalizado com segurança.")


if __name__ == "__main__":
    signal.signal(signal.SIGINT, handle_exit)
    signal.signal(signal.SIGTERM, handle_exit)

    parser = argparse.ArgumentParser(description="Script para alternar IP pela rede Tor.")
    parser.add_argument(
        "-t", "--tempo", type=int, default=int(os.getenv("INTERVALO_TEMPO", 60)),
        help="Intervalo (segundos) para trocar o IP (padrão: 60s ou valor no .env)"
    )
    args = parser.parse_args()

    
    if args.tempo <= 0:
        logging.error(" O tempo de troca deve ser um número positivo!")
        exit(1)

    main(args.tempo)
