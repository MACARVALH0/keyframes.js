<h1 align=center>Animações em Keyframes<br>geradas no código JavaScript ✨.</h1>

<p align=center><b>Keyframes.js</b> é o projeto simples de uma classe construtora<br>que transforma objetos JavaScript em animações CSS de verdade.</p>
<br>

<h2>Como surgiu?</h2>
<p>
  A ideia surgiu da necessidade de obter maior controle sobre animações CSS descritas em estruturas de <code>@keyframe</code>, o que não é possível alcançar utilizando apenas CSS nativo ou sem a implementação de bibliotecas mais elaboradas de animação.<br>
  No critério de usabilidade, a principal diretriz do projeto é de ser o mais simples possível, de modo que, tanto programadores com experiência quanto iniciantes possam utilizá-lo em testes simples sem a necessidade de aprender novos conceitos no caminho.
</p><br>

<h2>Como isso funciona?</h2>
<p>A classe <code>KeyframeAnimation</code> recebe por argumento um objeto de configuração com os seguintes parâmetros:</p><br>

| Parâmetro | Tipo de valor | Descrição               |
|-----------|---------------|-------------------------|
| html_element            | HTMLElement     | **Obrigatório**. Você precisa apontar o elemento HTML vítima das suas animações, afinal. |
| keyframe_struct         | Objeto          | **Obrigatório**. O construtor só iniciará sua mágica se o objeto de keyframes estiver presente.<br>(Há uma melhor descrição sobre ele a seguir) |
| animation_duration      | Inteiro         | Define a duração, em milissegundos, de cada ciclo (iteração) da animação. O valor padrão, caso não especificado, é de **2000**, ou seja, dois segundos.<br> |
| is_infinite             | Booleano        | Define se a animação deve se repetir por um determinado número de vezes ou até ser interrompida. Recebe `false` como padrão.<br>(Leia o trecho "**Objeto de Animação**" para mais informações) |
| repeat_initial_state    | Booleano        | Define se o estado inicial do elemento deve ser recuperado a cada iteração completa da animação. |

<br>
<h2>Objeto de Animação</h2>
<p>Após ser criada, a classe retorna um <b>Objeto de Animação</b>, que pode conter os métodos <code>start()</code> e <code>finish()</code> ou o método <code>play()</code>, dependendo do parâmetro <code>is_infinite</code> citado acima.</p>



<p>🔧 Em construção... 🔨</p>
