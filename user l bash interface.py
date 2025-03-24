#!/bin/bash

# Cores
LARANJA='\033[38;5;214m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
WHITE='\033[1;37m'
NC='\033[0m'

# URL para verificar IP
URL="https://httpbin.org/ip"
PROXIES="--socks5-hostname 127.0.0.1:9050"

# Função para exibir logo
exibir_logo() {
    clear
    echo -e "${LARANJA}"
    echo " ██████╗ ██████╗  ██████╗ ██████╗  "
    echo "██╔════╝ ██╔══██╗██╔═══██╗██╔══██╗ "
    echo "██║  ███╗██████╔╝██║   ██║██████╔╝ "
    echo "██║   ██║██╔══██╗██║   ██║██╔═══╝  "
    echo "╚██████╔╝██║  ██║╚██████╔╝██║      "
    echo " ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝      "
    echo -e "${NC}"
    echo -e "${YELLOW}🔥 Tor IP Changer GUI 🔥${NC}"
}

# Função para verificar se o Tor está rodando
verificar_tor() {
    systemctl is-active --quiet tor
    if [[ $? -ne 0 ]]; then
        echo -e "${RED}[!] O Tor NÃO está rodando! Inicie-o antes.${NC}"
        exit 1
    else
        echo -e "${GREEN}[+] O Tor está ativo.${NC}"
    fi
}

# Função para obter IP via Tor
obter_ip() {
    echo -e "${YELLOW}[*] Obtendo IP via Tor...${NC}"
    IP=$(curl -s $PROXIES $URL | jq -r '.origin')
    if [[ -z "$IP" ]]; then
        echo -e "${RED}[!] Erro ao obter IP.${NC}"
    else
        echo -e "${GREEN}[+] Seu IP atual: $IP${NC}"
    fi
}

# Função para reiniciar o Tor
reiniciar_tor() {
    echo -e "${YELLOW}[*] Reiniciando o Tor...${NC}"
    sudo systemctl restart tor
    sleep 3
    echo -e "${GREEN}[+] Tor reiniciado!${NC}"
}

# Função para trocar IP automaticamente
modo_automatico() {
    read -p "Digite o intervalo (segundos) para troca de IP: " tempo
    while true; do
        obter_ip
        echo -e "${LARANJA}[*] Aguardando $tempo segundos antes de trocar o IP...${NC}"
        sleep $tempo
        reiniciar_tor
    done
}

# Menu principal
menu_principal() {
    while true; do
        clear
        exibir_logo
        echo -e "${LARANJA}═════════════════════════════════════${NC}"
        echo -e "${GREEN}  [1]${WHITE} Verificar IP via Tor"
        echo -e "${GREEN}  [2]${WHITE} Reiniciar o Tor"
        echo -e "${GREEN}  [3]${WHITE} Modo Automático"
        echo -e "${RED}  [4] Sair${NC}"
        echo -e "${LARANJA}═════════════════════════════════════${NC}"
        read -p "Escolha uma opção: " opcao
        case $opcao in
            1) obter_ip ;;
            2) reiniciar_tor ;;
            3) modo_automatico ;;
            4) echo -e "${RED}[!] Saindo...${NC}"; exit 0 ;;
            *) echo -e "${RED}[!] Opção inválida!${NC}"; sleep 1 ;;
        esac
    done
}

# Executar script
verificar_tor
menu_principal
