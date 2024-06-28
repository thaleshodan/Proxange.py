import os 
import requests
from time import sleep

def Main ():
    change = int(input("depois de quantos segundos você vai querer  mudar de ip")
    os.system ("serviço de proxychains pela rede tor iniciando")
    url = "https://httbin.org/ip"
    proxy = {'http':'socks5://127.0.0.1:9050',
             'https':'socks5://127.0.0.1:9050'}
    while True 
          requests = requests.get(url, proxies=proxy)
          if requests.status_code == 200:
                 print("seu ip atual ::  {}".format(request.json().get)
              else:
                  print("falha para obter seu ip atual")
             sleep(change)
             os.system("serviço tor recarregado")

if __name__ == "__Main__":
    Main