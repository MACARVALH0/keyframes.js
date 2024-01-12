<h1 align=center>Animações em Keyframes<br>geradas no código JavaScript ✨.</h1>

<p align=center><b>Keyframes.js</b> é o projeto simples de uma classe construtora<br>que transforma objetos JavaScript em animações CSS de verdade.</p>
<br>

<h2>Como surgiu?</h2>
<p>
  A ideia do projeto se originou da necessidade de maior controle sobre animações CSS descritas em estruturas de <code>@keyframe</code>, o que não é possível alcançar utilizando apenas CSS nativo e sem recorrer a bibliotecas mais elaboradas de animação.<br><br>
  Em termos de usabilidade, a principal diretriz do projeto é evitar complexidades desnecessárias na adaptação e no uso, de modo que programadores experientes e iniciantes possam utilizá-lo em testes simples sem a necessidade de aprender novos conceitos no caminho.
</p><br>

<h2>Como isso funciona?</h2>
<p>A classe <code>KeyframeAnimation</code> recebe por argumento um objeto de configuração com os seguintes parâmetros:</p><br>

| Parâmetro | Tipo de valor | Descrição               |
|-----------|---------------|-------------------------|
| `html_element`            | HTMLElement     | **Obrigatório**. Você precisa apontar o elemento HTML vítima das suas animações, afinal. |
| `keyframe_struct`         | Objeto          | **Obrigatório**. O construtor só iniciará sua mágica se o objeto de keyframes estiver presente.<br>(Há uma melhor descrição sobre ele no trecho "**Objeto de Keyframe**") |
| `animation_duration`      | Inteiro         | Define a duração, em milissegundos, de cada ciclo (iteração) da animação. O valor padrão, caso não especificado, é de `2000`, ou seja, dois segundos.<br> |
| `is_infinite`             | Booleano        | Define se a animação deve se repetir por um determinado número de vezes ou até ser interrompida. Recebe `false` como padrão.<br>(Leia o trecho "**Objeto de Animação**" para mais informações) |
| `repeat_initial_state`    | Booleano        | Define se o estado inicial do elemento deve ser recuperado a cada iteração completa da animação. |

<br>
<h2>Objeto de Animação</h2>
<p>
  Após ser criada, a classe retorna um <b>Objeto de Animação</b>, que pode conter os métodos <code>start()</code> e <code>finish()</code> ou o método <code>play()</code>, dependendo do parâmetro <code>is_infinite</code> citado acima.
</p>

<p><b>Especificação dos métodos:</b></p>

**`start()`**: Inicia o loop de animação, que se repete indefinidamente, até que a função `finish()` seja chamada.<br>
**`finish()`**: Encerra o loop de animação.<br>
<br>
**`play(iteration_count)`**: Inicia o loop de animação com um parâmetro `iteration_count` do tipo inteiro, apontando o número de vezes que o loop deve se repetir. Caso `iteration_count` não seja especificado, assume o valor `1` como padrão.<br>

<br>
<h2>Objeto de Keyframe</h2>
<p>
  O <b>objeto de keyframes</b> descreve a estrutura lógica da animação em um modelo similar ao nativo na linguagem CSS. A forma como é escrito, no entanto, se assemelha muito ao formato de JSON, uma vez que usa diretamente características típicas da notação de objetos em JavaScript.
  No objeto, tanto as marcações de tempo quanto nomes de propriedade e seus respectivos valores são strings, como no exemplo a seguir: <br>
  
```javascript
keyframe_obj_example =
{
  "25%": 
  {
      "background-color": "rgb(255 0 0)",
      "transform": "rotate(10deg)"
  },
  
  "50%":
  {
      "background-color": "rgb(0 255 0)",
      "transform": "rotate(-10deg)"
  },
  
  "75%":
  {
      "background-color": "rgb(0 0 255)",
      "transform": "rotate(10deg)"
  },
  
  "100%":
  {
      "background-color": "rgb(0 0 0)",
      "transform": "rotate(-10deg)"
  }
}
```

Este seria um possível argumento para o parâmetro `keyframe_struct` no objeto de configuração passado ao construtor.
Importante perceber que os nomes das propriedades CSS são escritos da forma convencional, e não em sua adaptação em camel case, como no caso de propriedades do construtor CSSStyleDeclaration (Por exemplo, escreve-se "background-color ao invés de "backgroundColor").
</p>

<p>🔧 Em construção... 🔨</p>
