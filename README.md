# rout-easy-challenge-fullstack

### Desafio para avaliação de habilidades full-stack

Stack MEAN
Data de recebimento do desafio: 03/10/2019

#### Observações

###### Gostaria muito de utilizar o sweetlert2 para notificar algumas coisas, mas por ser um protótipo, preferi não entrar nos mínimos detalhes !!!

###### Algumas validações bruscas estão sendo feitas sem avisa, apenas para simplificar:

###### -Digitar ao menos 5 caracteres para buscar endereço

###### -Se não preencher os 3 campos do cliente e buscar o endereço o botão de cadastrar simplesmente não funciona (Sem avisar o que esta errado t.t)

###### -Não pede nenhum tipo de confirmação para deletar tudo (seria o ideal)

###### Só gostaria de deixar bem claro que é apenas um protótipo, sem muitas validações, nem otimização de desempenho, apenas para demonstrar conhecimento nas linguagens !!!

###### Quanto ao layout, torná-lo responsivo levaria mais tempo de adaptações, e provavelmente usaria alguma lib como o Materialize ou Material Design como de costume, mas neste caso esta simplificado e a largura mínima é de 800px

###### Em um projeto maior, que costumo separar mais os componentes, mesmo dentro de um domínio como entrega (delivery), eu separaria em arquivos diferentes as questões de eventos dom, funções do mapa, funções da tabela, uma tela só com o mapa e outra só com a tabela em forma de componente, mas para simplificar ficou tudo junto !!!

#

#

## Variáveis de ambiente necessárias:

#### Web Port

    PORT=8080

#### Google Geocode API

    GOOGLE_API_KEY=<KEY>

#### Database

    MONGODB_CONNECTION_STRING=mongodb://<server>:27017/<db>?authSource=admin
