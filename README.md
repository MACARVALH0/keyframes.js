<h1 align=center>Animações em Keyframes<br>geradas no código JavaScript ✨.</h1>

<p align=center><b>Keyframes.js</b> é o projeto simples de uma classe construtora<br>que transforma objetos JavaScript em animações CSS de verdade.</p>
<br>

<h2>Como isso funciona?</h2>
<p>A classe <code>KeyframeAnimation</code> recebe por argumento um objeto de configuração com os seguintes parâmetros:</p><br>

| Parâmetro | Tipo de valor | Descrição               |
|-----------|---------------|-------------------------|
| html_element            | HTMLElement     | **Obrigatório**. Você precisa apontar o elemento HTML vítima das suas animações, afinal. |
| keyframe_struct         | Objeto          | **Obrigatório**. O construtor só iniciará sua mágica se o objeto de keyframes estiver presente.<br>(Há uma melhor descrição sobre ele a seguir) |
| animation_duration      | Inteiro         | Define a duração, em milissegundos, de cada ciclo (iteração) da animação. O valor padrão, caso não especificado, é de **2000**, ou seja, dois segundos.<br> |
| is_infinite             | Booleano        | Define se a animação deve se repetir por um determinado número de vezes ou até ser interrompida. Recebe `false` como padrão.<br>(Leia o trecho "**Objeto de Animação**" para mais informações) |
| repeat_initial_state    | Booleano        | Define se o estado inicial do elemento deve ser recuperado a cada iteração completa da animação. |

<p>🔧 Em construção... 🔨</p>
