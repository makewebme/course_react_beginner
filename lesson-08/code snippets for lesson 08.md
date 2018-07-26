
Урок 8. Обработчики событий и условный рендеринг
=====================================================================

===========================
=== ОБРАБОТЧИКИ СОБЫТИЙ ===
===========================

Пора поговорить про обработку событий. Чтобы интерфейс приложения работал и пользоватлеь мог с ним взаимодействовать, нам необходимо подвязывать свои действия на каие-то события - чаще всего это обработчики кликов, но могут быть и события скролла, хавера и разные другие. Более того, в приложении можно создавать свои кастомные события, возникаещие в те или иные моменты и подвязывать свои действия на них.

Итак, как в обычном HTML-коде создать обработчик клика? Необходимо просто написать атрибут onclick и в кавычках вызвать нужную функцию:

```
<script> function showModal() { console.log('showModal') } </script>
<button onClick="showModal()">showModal</button>
```

Очень просто.
В реакте же почти так же, но onClick пишется обязательно кэмел-кейсом, а функция оформляется в фигурных скобках и не содержит круглых скобок для вызова:

```
import React from 'react'
import ReactDOM from 'react-dom'

function showModal () {
  console.log('showModal')
}

function TestComponent () {
  return <button onClick={showModal}>showModal</button>
}

ReactDOM.render(<TestComponent />, document.getElementById('root'))

```

Если в HTML у нас есть ссылка, то привязать к клику по ней свое действие и отвязать стандартное - переход по ссылке - можно вернув false.

```
<script> function showModal() { console.log('showModal') } </script>
<a href="http://makeweb.me" onClick="showModal(); return false;">Show modal, not go to link</a>
```

В JSX-разметке Реакта так делать нельзя. Вместо этого мы в обработчике события вызываем стандартный метод preventDefault на event-объекте, тем самым также отменяя переход по ссылке:

```
function showModal (e) {
  e.preventDefault()
  console.log('showModal')
}

function TestComponent () {
  return (
    <a href="http://makeweb.me" onClick={showModal}>
      Show modal, not go to link
    </a>
  )
}
```

Замечу, что события Реакта являются синтетическими, то есть это обертки над нативными событиями. И это дает плюс в плане кроссбраузерной совместимости - там внутри все сделано грамотно - остается только пользоваться.

Интересно, что при написании JS-кода обычно не используется такой подход, при котором обработчики событий назначаются через атрибуты - рекомендуют использовать метод addEventListener, которым обладает любая нода, взятая из DOM-дерева. Здесь же это работает очень даже - просто пишем что сделать на тот же onClick, и оно происходит.

И еще момент - в JS вам нужно убедиться, что код с навешиванием обработчиков выполняется не раньше чем ноды были отрисованы в DOMе, тут же присвоение происходит при первом рендере содержимого компонента и вам не нужно дополнительно об этом беспокоиться.

В данном коде я объявил обработчик клика в виде функции и вообще использовал презентационный компонент. Если же использовать класс, то паттерн создания обработчика будет таким:

```
import React from 'react'
import ReactDOM from 'react-dom'

class Modal extends React.Component {
  state = { modalVisible: false }

  toggleModalHandler = (e) => {
    console.log(e.target)
    console.log(this)

    this.setState(
      prevState => ({ modalVisible: !prevState.modalVisible })
    )
  }

  render () {
    return (
      <div>
        {this.state.modalVisible
          ? (
            <div className="modal">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi est ab molestias natus nam, harum commodi soluta optio explicabo. Tempora minima consequuntur quos nemo, nobis quibusdam molestias numquam. Et, debitis.
            </div>
          )
          : null
        }

        <button onClick={this.toggleModalHandler}>
          toggleModal
        </button>
      </div>
    )
  }
}

ReactDOM.render(<Modal />, document.getElementById('root'))
```

Разберемся поподробнее. Я создал компонент Modal, в котором при нажатии на кнопку, вызывается метод класса toggleModalHandler. Он переключает нашу псевдомодалку из видимого состояния в невидимое, и наоборот. Псевдо, потому что я никак ее не стилизовал. А в рендере я проверяю состояние modalVisible и возвращаю либо модалку, либо ничего, чем нужный визуальный эффект и достигается.

Итого, паттерн можно описать так. В обработчике события вызываем метод класса, а уже из него делаем необходимые операции. Можно конечно вместо this.toggleModalHandler написать стрелочную функцию, но этого лучше не делать, так как при каждом перерендере она будет пересоздаваться заново, так как на то она и анонимная - выполнилась и уничтожилась. Такие потери нам ни к чему, поэтому объявлем только как метод класса.

Еще, есть момент насчет сохранения контекста внутри функции-обработчика - в нашем случае toggleHandlerModal. Если мы объявляем метод как стрелочную функцию (на самом деле по-правильному это назвается "public class fields syntax", потому что по сути это присвоение значения полю класса, а не создание метода) - вот оно видно тут - то контекст не теряется и this ссылается на наш компонент Modal. При этом достучаться до ноды на которой произошло событие - в нашем случае это кнопка - можно через event-объект вот так так: e.target.

Если это просто метод класса, то нужно в его конструкторе жестко забайндить this к методу, иначе this будет равен undefined.

Первый способ предпочтительнее, по мне так, но для его поддержки нужно подключать определенные пресеты для Babel. Хотя в create-react-app уже все настроено как надо.

Ну и слово Handler обычно добавляется к обработчикам событий, чтобы их отдельно выделить. Это хорошая практика, но не обязательная. Можно писать и иначе - скажем handleToggleModal. Главное выработайте единообразный подход хотя бы в рамках одного проекта.

Что если мы хотим передать какие-то дополнительные аргументы в наш обработчик?

Тут два выхода.

Первый - обернуть вызов в стрелочную функцию:

```
toggleModalHandler = (e, arg1, arg2) => {
  console.log(arg1)
  console.log(arg2)

  this.setState(
    prevState => ({ modalVisible: !prevState.modalVisible })
  )
}

<button onClick={(e) => this.toggleModalHandler(e, 'arg1_value', 'arg2_value')}>
  toggleModal
</button>
```

В этом случае, на onClick вызывается анонимная функция, у которой внутри this равен нашему компоненту Modal и в которую браузер прокидывает event-объект. Поэтому this.toggleModalHandler вызовет наш обработчик клика и при вызове мы можем передать туда все те аргументы, которые прожелаем. Я первый пробрасываю event-объект, а затем два моих произвольных аргумента, чем и могу пользоваться внутри toggleModalHandler.

Есть и второй вариант - использование bind:

```
toggleModalHandler (arg1, arg2, e) {
  console.log(arg1)
  console.log(arg2)
  console.log(e.target)

  this.setState(
    prevState => ({ modalVisible: !prevState.modalVisible })
  )
}

<button onClick={this.toggleModalHandler.bind(this, 'arg1_value', 'arg2_value')}>
  toggleModal
</button>
```

Джаваскриптовый bind ведь (в отличие от call и apply) не вызывает функцию на месте, а позволяет указать каков будет контекст и затем какие аргументы передадутся при вызове. А это как раз то что нам нужно.

В данном случае, event-объект прокинется в обработчик последним аргументом, после всех наших произвольных аргументов.



==========================
=== УСЛОВНЫЙ РЕНДЕРИНГ ===
==========================

Следующий момент, который мы расмотрим, это условный рендеринг, то есть то, какими способами, основываясь на определенных условиях рисовать или не рисовать те или иные части разметки или компоненты. Эта задача очень часто встречается, поэтому вы должны знать о возможных способах ее решения.

На самом деле, мы уже с условным рендерингом встречались, посмотрите урок 6 данного курса примерно начиная с 7ой минуты. Но сначала предлагаю разобрать способы, а затем глянете в указанное место.

Мы будем рассматривать примеры из документации.



=== 1 ===

Первый вариант, это проверка через обычный оператор if.

```
import React from 'react'
import ReactDOM from 'react-dom'

function UserGreeting(props) {
  return <h1>Welcome back!</h1>
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>
}

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn

  if (isLoggedIn) {
    return <UserGreeting />
  }

  return <GuestGreeting />
}

ReactDOM.render(
  <Greeting isLoggedIn={true} />,
  document.getElementById('root')
)
```

Здесь у нас два презентационных компонента:
UserGreeting для приветствия залогиненного пользователя
и GuestGreeting для приветствия, соответственно, незалогиненного.

Через ReactDOM.render же мы рисуем компонент Greeting, в который пробрасываем пропс isLoggedIn c булевым значением. Внутри него считываем это значение и если оно равно true, то пользователь залогинен и мы возвращаем компонент UserGreeting, в противном случае - возвращаем GuestGreeting.

Это и есть условный рендеринг.



=== 2 ===

Второй способ заключается в том, что компоненты присваиваются переменным, из которых потом и происходит отрисовка.

Сейчас сделаем так, чтобы можно было менять состояние залогиненности путем нажатия на кнопку.

Код такой:

```
import React from 'react'
import ReactDOM from 'react-dom'

function UserGreeting(props) {
  return <h1>Welcome back!</h1>
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>
}

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn

  if (isLoggedIn) {
    return <UserGreeting />
  }

  return <GuestGreeting />
}

function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  )
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  )
}

class LoginControl extends React.Component {
  constructor(props) {
    super(props)
    this.handleLoginClick = this.handleLoginClick.bind(this)
    this.handleLogoutClick = this.handleLogoutClick.bind(this)
    this.state = {isLoggedIn: false}
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true})
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false})
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn
    let button

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    )
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
)
```

Использованы компоненты UserGreeting, GuestGreeting и Greeting из предыдущего примера.
LoginButton и LogoutButton рисуют кнопки логина и логаута, причем через пропсы принимают в себя обработчик клика - свой для каждой кнопки.

Корневым компонентом является LoginControl. Именно внутри него объявлены методы-обработчики событий клика по кнопкам. handleLoginClick меняет в стейте компонента LoginControl значение isLoggedIn на true, а handleLogoutClick работает строго наоборот.

В этом примере, перед возвратом разметки из render'а, мы проверяем условие и в зависимости от этого в переменной button, которая объявлена здесь, оказывается тот или иной компонент с тем или иным обработчиком клика.

Ну и в разметке мы, как и прежде, рисуем Greeting, а кнопка ниже берется из переменной. Думаю, как работает этот код вам теперь понятно. Ну и что компоненты можно присваивать переменным - тоже. Если вдуматься, то JSX-код здесь при помощи Babel превращается в вызов функции, так что ничего невероятного в этом нет.



=== 3 ===

Еще одним интересным способом выполнить условный рендеринг, является использование двойного амперсанда. Как вы знаете, наверное, в JavaScript можно писать вот так: false && 1
В консоли это выдаст нам false, а до единички мы никогда не дойдем.
В противовес этому, написав true && 1, в консоли выведется 1.

То есть, если до амперсандов было выражение, дающее false, то то что после - никогда не выполнится, а если там будет true, то вторая часть выражения выполнится.

Так вот, сейчас мы сделаем так, чтобы если пользователь залогинен, выводилась бы рандомная аватарка-плейсхолдер.

```
...метод render компонента LoginControl
  return (
    <div>
      <Greeting isLoggedIn={isLoggedIn} />

      {isLoggedIn && <img src='http://i.pravatar.cc/300' alt='' />}

      {button}
    </div>
  )
...
```

Я дал достаточно подробные объяснения ранее, так что понять почему это работает, вам не составит труда.



=== 4 ===

Следующим способом выполнить условный рендеринг будет использование короткого синтаксиса для оператора if.

```
render() {
  const isLoggedIn = this.state.isLoggedIn

  return (
    <div>
      <Greeting isLoggedIn={isLoggedIn} />

      {isLoggedIn && <img src='http://i.pravatar.cc/300' alt='' />}

      {isLoggedIn
        ? (
          <LogoutButton onClick={this.handleLogoutClick} />
        )
        : (
          <LoginButton onClick={this.handleLoginClick} />
        )
      }
    </div>
  )
}
```

Символ вопроса указывает на первую ветку if'а которая выполняется если выражение - в нашем случае значение isLoggedIn - равно true, а символ двоеточия это ветка, выполняющаяся при isLoggedIn равном false.

Получается очень компактно и элегантно.



=== 5 ===

И наконец, последнее по теме условного рендеринга.

```
function Avatar(props) {
  return props.isLoggedIn
    ? <img src='http://i.pravatar.cc/300' alt='' />
    : null
}

class LoginControl extends React.Component {
  constructor(props) {
    super(props)
    this.handleLoginClick = this.handleLoginClick.bind(this)
    this.handleLogoutClick = this.handleLogoutClick.bind(this)
    this.state = {isLoggedIn: false}
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true})
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false})
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />

        <Avatar isLoggedIn={isLoggedIn} />

        {isLoggedIn
          ? (
            <LogoutButton onClick={this.handleLogoutClick} />
          )
          : (
            <LoginButton onClick={this.handleLoginClick} />
          )
        }
      </div>
    )
  }
}
```

Я вынес отрисовку аватарки из выражения с двумя амперсандами, в отдельный презентационный компонент. И там, в первом случае возвращаю img, а во втором null. рекомендуется делать именно так. Но в общем-то можно было бы записать это и так:


```
return props.isLoggedIn && <img src='http://i.pravatar.cc/300' alt='' />
```

Главное, чтобы возвращалось либо что-то что можно отрисовать в DOM'е, либо null или false. Предпочтительнее именно null, как это сказано в документации React.
