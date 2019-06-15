
Урок 12. Все про ref'ы
=====================================================================

Давайте рассмотрим так называемые ref'ы. На самом деле это просто сокращение от английского reference - ссылка.
В сущности они просто позволяют получить доступ к тем нодам внутри компонента, которые были созданы в результате выполнения метода render().

Это бывает нужно по разным причинам:
- при работе с API для выделения текста или с фокусом текстовых полей,
- произведения каких-то анимаций, перемещений и изменений внешнего вида путем прямого взаимодействии с нодой (хотя рекомендуется маскимально этого не делать), замеров размеров DOM-нод,
- при работе с внешними библиотеками - скажем с jQuery (хотя уж его точно не стоит использовать в современных React-приложениях).

Поначалу новички, особенно те, кто перешел с jQuery на React могут злоупотреблять использованием рефов, однако со временем все становится на свои места.

Итак, исторически ref'ы в React прошли эволюционный путь, состоящий из трех этапов.


  
===
Ref как строка
===

Сначала ref'ы задавались строкой. Сразу замечу, что этот синтаксис устаревший, так что никогда его не используйте в современных приложениях. А выглядело это так:

```
class App extends React.Component {
  state = { value: '' }

  handleSubmit = e => {
    e.preventDefault()
    this.setState(_ => ({ value: this.refs.textInput.value }))
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type='text' ref='textInput' />
        <button>Submit</button>
        {this.state.value && <h3>Вы отправили: {this.state.value}</h3>}
      </form>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
```

Здесь у целевой ноды, к которой мы хотим обратиться, стоит специальный атрибут ref и его значение - строка. А эта строка фигурирует и вот здесь - в методе handleSubmit, срабатывающем когда мы отправляем форму. То есть this.refs это специальное поле в нашем инстансе компонента, которое хранит все подобные рефы, которые определены внутри этого компонента. Оттуда к ним доступ и осуществляется.



===
Ref как callback
===

Следующим этапом стала передача функции в атрибут ref.

```
class FocusedTextInput extends React.Component {
  constructor(props) {
    super(props)
    this.setTextInputRef = element => this.textInput = element
  }

  focusTextInput = _ => {
    if (this.textInput) this.textInput.focus()
  }

  componentDidMount() {
    this.focusTextInput()
  }

  render() {
    return (
      <div>
        <input type='text' ref={this.setTextInputRef} />
        <input type='button' value='Focus' onClick={this.focusTextInput} />
      </div>
    )
  }
}

ReactDOM.render(<FocusedTextInput />, document.getElementById('root'))
```

Здесь в ref передается уже не строка, а колбэк, который после своего выполнения (после первого рендера), в this.textInput сохраняет ссылку на нативную браузерную DOM-ноду, к которой в componentDidMount мы и обращаемся вызывая метод focus. Это, после того как компонент замаунтился, заставляет его поймать фокус.

Вы можете быть уверены, что ДО выполнения методов жизненного цикла componentDidMount и componentDidUpdate, ref'ы уже будут установлены.



===
Ref как вызов createRef
===

Ну и наконец самым современным и рекомендуемым способом является вызов в конструкторе метода React.createRef():

```
class App extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }
  
  componentDidMount() {
    console.log(this.inputRef.current.value)
  }

  render() {
    return <input type='text' ref={this.inputRef} value='testVal' />
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
```

Тут вообще все просто. Вызов обозначенной выше функции создает в this.inputRef структуру данных, которая пердназначена для хранения ref'а. А в render в ref передается ссылка на эту структуру в классе компонента. И вот, ref уже готов к использованию. Пишем this.inputRef.current и получаем ссылку на DOM-ноду:

Видно, что в консоли после выполнения componentDidMount появилось содержимое инпута.

===

Еще момент - мы можем в дочерний компонент передать ref как один из пропсов, который будет называться иначе чем ref, и затем уже в дочернем установить его на конкретный элемент, чтобы получить из родителя доступ к ноде дочернего элемента.

```
class Parent extends React.Component {
  constructor(props) {
    super(props)
    this.setTextInputRef = element => this.textInput = element
  }

  focusTextInput = _ => {
    if (this.textInput) this.textInput.focus()
  }

  componentDidMount() {
    this.focusTextInput()
  }

  render() {
    return (
      <div>
        <CustomTextInput setTextInputRef={this.setTextInputRef} />
        <input type='button' value='Focus' onClick={this.focusTextInput} />
      </div>
    )
  }
}

class CustomTextInput extends React.Component {
  render() {
    return <input
      style={{ backgroundColor: '#0d4' }}
      type='text' ref={this.props.setTextInputRef}
    />
  }
}

ReactDOM.render(<Parent />, document.getElementById('root'))
```

Данный код демонстрирует, как колбэк, устанавливающий в Parent ссылку на DOM-ноду мы можем отправить в дочерний компонент. Это происходит вот здесь, в пропсе setTextInputRef. Этот колбэк мы отправляем в пропс ref компонента CustomTextInput и так как этот колбэк объявлен в родительском компоненте, то и ссылка на DOM-ноду установится там же. Соответственно, после componentDidMount инпут нормально зафокусится. Как и в примере выше.

Фактически, мы сейчас кастомизировали инпут и заставили его работать так, будто бы он находится прямо в компоненте Parent.

===

А вот еще более интересный пример:

```
class Parent extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  focusInput = () => this.inputRef.current.focusInput()

  render() {
    return (
      <div>
        <CustomTextInput ref={this.inputRef} />
        <input type='button' value='Focus' onClick={this.focusInput} />
      </div>
    )
  }
}

class CustomTextInput extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  focusInput = () => this.inputRef.current.focus()

  render() {
    return <input type='text' ref={this.inputRef} />
  }
}

ReactDOM.render(<Parent />, document.getElementById('root'))
```

Тут мы пропс ref пишем прямо у компонента, а не у известного браузеру HTML-элемента. И это работает иначе.

Компонент Parent уже рассмотренным ранее способом готовит в конструкторе поле для ref'а, затем в рендере ссылка создается. И если посмотреть, то она будет указывать на React-компонент, а не на DOM-ноду как в предыдущих случаях. Вот это и есть преимущество, так как получив такую ссылку, мы можем у CustomTextInput вызывать его методы. По нажатию на кнопку фокуса такой метод focusInput у CustomTextInput как раз и вызывается из Parent. А CustomTextInput уже внутри себя имеет ref на конкретный HTML-элемент инпут и может через this.inputRef.current вызвать нативный браузерный метод focus. И вот, наша задача достигнута.

Замечу, что такое не пройдет с компонентами, объявленными как функции, в отличие от тех, что объявлены в качестве класса. Такое просто-напросто не будет работать. Ведь нет инстанса и не у кого вызывать метод.

===

Но если же компонент у вас все же объявлен как функция, в него можно пробросить другую функцию, устанавливающую ref в классе родителя и работать с этим так же. Это было уже рассмотрено ранее.

```
class Parent extends React.Component {
  constructor(props) {
    super(props)
    this.setTextInputRef = element => this.textInput = element
  }

  focusTextInput = _ => {
    if (this.textInput) this.textInput.focus()
  }

  componentDidMount() {
    this.focusTextInput()
  }

  render() {
    return (
      <div>
        <CustomTextInput setTextInputRef={this.setTextInputRef} />
        <input type='button' value='Focus' onClick={this.focusTextInput} />
      </div>
    )
  }
}

function CustomTextInput(props) {
  return (
    <input
      style={{ backgroundColor: '#0d4' }}
      type='text' ref={props.setTextInputRef}
    />
  )
}

ReactDOM.render(<Parent />, document.getElementById('root'))
```

===

Вообще же, в компоненте, объявленном как функция, можно использовать ref'ы:

```
function MyTextInput(props) {
  const textInput = React.createRef()

  const handleClick = _ => textInput.current.focus()

  return (
    <div>
      <input type='text' ref={textInput} />
      <button onClick={handleClick}>Focus</button>
    </div>
  )
}

ReactDOM.render(<MyTextInput />, document.getElementById('root'))
```

Вместо использования конструктора мы просто создаем переменные - с инициализацией структуры под ref и с обработчиком клика по кнопке.

===

Ну и давайте еще вспомним для полноты картины про метод ReactDOM.findDOMNode. Он получает в качестве аргумента React-компонент и позволяет покопаться в DOM-содержимом его инстанса (ну или экземпляра - напоминание для тех кто еще не запомнил, что это одно и то же).

```
class Parent extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  focusInput = () => {
    // console.log(ReactDOM.findDOMNode(this.inputRef.current))
    // ReactDOM.findDOMNode(this.inputRef.current).querySelector('.test-node').innerText = 'Changed'
    this.inputRef.current.focusInput()
  }

  render() {
    return (
      <div>
        <CustomTextInput ref={this.inputRef} />
        <input type='button' value='Focus' onClick={this.focusInput} />
      </div>
    )
  }
}

class CustomTextInput extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  focusInput = () => this.inputRef.current.focus()

  render() {
    return (
      <div>
        <input type='text' ref={this.inputRef} />
        <div className='test-node' />
      </div>
    )
  }
}

ReactDOM.render(<Parent />, document.getElementById('root'))
```

Я модифицировал предыдущий пример и добавил в обработчик клика кнопки Focus вывод в консоль результата работы ReactDOM.findDOMNode, которой я передал ссылку на наш компонент CustomTextInput, а точнее на его инстанс - не забываем про current в конце - и это дает нам DOM-ноду, с которой можно делать все, что позволено в браузере делать с DOM-нодой.

Например, давайте поменяем её текст. Вот так - взяли её инстанс, поискали по классу с помощью querySelector и поменяли innerText. Результат вы видите на экране.

Но правда лучше использовать эту штуку в самом крайнем случае, когда ну ничего уже не помогает. В специальном ограниченном режиме Strict Mode реакта, это работать перестанет. Про Strict мы еще поговорим.

===

Теперь про так называемый Ref Forwarding. О чем идет речь? Рассмотрим такую кнопку:

```
function CustomBtn(props) {
  return (
    <button className="CustomBtn">
      {props.children}
    </button>
  )
}

ReactDOM.render(
  <CustomBtn>
    <strong>SEND</strong>
  </CustomBtn>,
  document.getElementById('root')
)
```

Рисуется обычный button и то, что внутри него, соответственно также отрисуется благодаря props.children - нам уже это известно. По-хорошему, один компонент не должен вмешиваться в разметку другого и менять стили или тем более структуру его дерева элементов. Но это больше справедливо для высокоуровневых компонентов вроде комментариев или календаря какого-нибудь. Для простых же компонентов вроде стилизованной кнопки или инпута, это удобно, чтобы изменить фокус, допустим. Или как-то анимировать. Или выделить текст.

И вот тут-то Forwarding Ref приходятся как нельзя кстати. Да, по-русски это можно перевести как "пробрасываемые рефы".

```
const CustomBtn = React.forwardRef((props, ref) => (
  <button ref={ref} className='CustomBtn'>
    {props.children}
  </button>
))

class App extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  componentDidMount() {
    this.ref.current.focus()
  }

  render() {
    return (
      <CustomBtn ref={this.ref}>
        <strong>SEND</strong>
      </CustomBtn>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
```

Данный пример наглядно демонстрирует особенности пробрасываемых ref'ов. С помощью метода React.forwardRef мы создаем компонент нашей кнопки и в него пробрасываются не только пропсы, а еще и ref, который для нас эта обертка и создала. Далее этот реф пробрасывается в button.

Затем, когда мы используем в другом компоненте нашу кастомную кнопку, то пробрасываем ей ref, который создаем уже привычным способом. При маунтинге компонента App, наша кнопка прекрасно получает фокус. Все работает.

===

Эта техника хорошо применима в компонентах высшего порядка (higher-order components) - я их называю просто и удобно - ХОК - от соответствующего акронима.

Сейчас будет, возможно, немного запутанный для вас пример. Необходимо в него вникнуть хорошо, если хотите все до конца понять.

### index.js:
```
import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
```

### App.js:
```
import React from 'react'
import CustomBtn from './CustomBtn'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  componentDidMount() {
    console.log(this.ref.current)
    setTimeout(() => {
      this.ref.current.changeSendingStatus()
    }, 2000)
  }

  render() {
    return (
      <div className='wrapper'>
        <CustomBtn ref={this.ref}>
          SENDING...
        </CustomBtn>
      </div>
    )
  }
}

export default App
```

### LogProps.js (неработающий вариант)
```
import React from 'react'

function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    componentDidMount(prevProps) {
      console.log('old props:', prevProps)
      console.log('new props:', this.props)
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  return LogProps
}

export default logProps
```

### LogProps.js (работающий вариант)
```
import React from 'react'

function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    componentDidMount(prevProps) {
      console.log('old props:', prevProps)
      console.log('new props:', this.props)
    }

    render() {
      const {forwardedRef, ...rest} = this.props
      return <WrappedComponent ref={forwardedRef} {...rest} />
    }
  }

  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />
  })
}

export default logProps
```

### CustomBtn.js
```
import React from 'react'
import logProps from './LogProps'

class CustomBtn extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  changeSendingStatus = _ => this.ref.current.innerText = 'SENT'

  render() {
    return (
      <button className='custom-btn' ref={this.ref}>
        {this.props.children}
      </button>
    )
  }
}

export default logProps(CustomBtn)
```

Итак..

В index.js просто рисуется компонент App.

App рисует CustomBtn с надписью SENDING внутри, благодаря props.children. Тут же, создается ref и отправляется в пропс ref компонента CustomBtn. Как только App маунтится, он через этот реф у CustomBtn вызывает метод changeSendingStatus.

Дальше самое интересное. HOC-компонент LogProps. Его назначение, выводить пропсы любого компонента, который им обернут. В нашем случае CustomBtn как раз имеет обертку в виде logProps. И мы для начала посмотрим на неработающий вариант и поймем почему он не работает.

Тут у нас объяалена функция logProps с маленькой l. В нее пробрасывается тот, компонент, который нужно обернуть. Внутри объявляется класс LogProps с большой L. Он рендерит WrappedComponent, а это в нашем случае будет CustomBtn, и пробрасывает в него все пропсы, которые были проброшены этажом выше. Как только данный компонент-обертка маунтится, он все пропсы выводит - как предыдущие, так и текущие. И компонент LogProps возвращается из функции. Почему - сейчас поймем.

Оборачиваемый компонент CustomBtn. Вот тут, в экспорте, мы нашу кнопку оборачиваем заимпорченным logProps.

Смотрим еще раз на цепочку. При экспорта выполняется функция logProps, получая аргументом наш CustomBtn. Тут он уже называется WrappedComponent и возвращается из компонента LogProps, а уже компонент LogProps, завязанный на WrappedComponent, возвращается из функции logProps. И попадает в экспорт из CustomBtn. Вот так и получается что отрисованный в App.js CustomBtn уже обернут в logProps.

Но скользкий момент в том, что несмотря на то, что мы передали в CustomBtn ref, он передается в компонент обертку и не пробрасывается дальше, в сам CustomBtn, так как расспредивание this.props не затрагивает специальный реактовский пропс ref и он в этот список просто не включается. При попытке запустить код в этом случае, мы увидим, что ref в App.js будет указывать на LogProps. В этом-то и загвоздка.

И здесь на помощь приходит как раз ref forwarding. Вот измененный код logProps. Вот тут, вместо того, чтобы просто возвратить компонент LogProps, мы возвращаем результат выполения React-метода forwardRef, который получает аргументом колбэк. Туда пробрасываются пропсы и ref, тот самый, который ранее нам был недоступен. Пропсы деструктурируются отдельно, а ref отправляется в отдельный пропс forwardedRef. И тогда внутри LogProps в методе render, мы можем из его уже пропсов извлечь отдельно forwardedRef и остальные пропсы. forwardedRef попадает в ref, а остальные пропсы деструктурируются отдельно.

И вот теперь явно видно, что в App.js ref указывает на CustomBtn. Внутри него создается свой ref, который указывает на button и метод changeSendingStatus, где меняется текст кнопки на SENT. Кстати, плохой пример, потому что по идее текст внутри зависит от this.props.children, а тут прямое вмешательство с перезаписью этого текста. В общем, вы поняли как не надо делать =)

===

Мне будет очень интересно узнать, до конца ли вы поняли этот запутанный пример или нет. Отписывайтесь в комментариях.

===

Кстати, смотрите как выглядит React-дерево для этого примера. Вся наша структура дополнительно обернулась еще и в ForwardRef. Мы можем вместо стрелочной безымянной функции пробросить сюда функцию с именем:

```
import React from 'react'

function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    componentDidMount(prevProps) {
      console.log('old props:', prevProps)
      console.log('new props:', this.props)
    }

    render() {
      const {forwardedRef, ...rest} = this.props
      return <WrappedComponent ref={forwardedRef} {...rest} />
    }
  }

  return React.forwardRef(function CustomBtn (props, ref) {
    return <LogProps {...props} forwardedRef={ref} />
  })
}

export default logProps
```

Тогда в скобочках у ForwardRef это имя появится. Удобно для отладки.

А можно сделать еще круче:

```
import React from 'react'

function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    componentDidMount(prevProps) {
      console.log('old props:', prevProps)
      console.log('new props:', this.props)
    }

    render() {
      const {forwardedRef, ...rest} = this.props
      return <WrappedComponent ref={forwardedRef} {...rest} />
    }
  }

  function forwardRef (props, ref) {
    return <LogProps {...props} forwardedRef={ref} />
  }

  const name = WrappedComponent.displayName || WrappedComponent.name
  forwardRef.displayName = `logProps(${name})`

  return React.forwardRef(forwardRef)
}

export default logProps
```

Выносим данную функцию отдельно, назвав, например, forwardRef. Затем формируем имя оборачиваемого компонента в переменной name. Для этого берем у него значение displayName или name, если первого нет. дальше приписываем logProps и в скобках интерполируем name. И наконец, вызываем React.forwardRef с "пропатченной" функцией forwardRef.

===

Что ж.. Надеюсь материал данного урока не поплавил ваш мозг. Если так, то пересмотрите это видео несколько раз с промежутком в несколько дней, попутно запуская самостоятельно, а лучше набирая ручками, все примеры из урока. Всем удачи и встретимся на следующем занятии по React'у. Будет еще интереснее.