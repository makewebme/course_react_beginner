
Урок 11. Все про JSX
=====================================================================

Всем привет. Для начала в этом уроке разберемся в том, как работает этот самый магический синтаксис JSX.

=========================
=== ПОДРОБНЕЕ ПРО JSX ===
=========================

Когда мы пишем что-то вроде:

```
<User name='Peter'>
  <Avatar size='big' round />
  <p className='bio'>Some bio...</p>
</User>
```

То в реальности, с помощью Babel, это превращается в вызовы функции React.createElement:

```
import { createElement } from 'react'

createElement(
  User,
  { name: 'Peter' },

  createElement(
    Avatar,
    { size: 'big' },
    null
  ),

  createElement(
    'p',
    { class: 'bio' },
    'Some bio'
  )
)
```

Согласитесь, такой вариант на порядок более громоздок и неудобен чем JSX. Да какой там.. Он просто нежизнеспособен.

В функцию createElement мы передаем сначала имя HTML-тега в виде строки или ссылку на компонент React, написанный с большой буквы, затем объект со списком пропсов, передаваемых внутрь создаваемого элемента и, наконец, один или несколько дочерних элементов, которые будут либо текстом, либо вложенными вызовами createElement.

Так писать разметку было бы просто МРАК. В общем, у нас есть JSX. Тройное ура!

===

Компоненты можно называть через точку. Например, так:

```
const Components = {
  Button (props) {
    return <div className='btn'>{props.children}{props.title}</div>
  },

  Icon (props) {
    return <div className='icon'><img src={props.path} /></div>
  }
}

const Button = _ => <Components.Button title='Отправить' />

const ButtonWithIcon = _ => (
  <Components.Button title='Отправить'>
      <Components.Icon path='https://cdn1.iconfinder.com/data/icons/materia-arrows-symbols-vol-4/24/018_097_enter_send_arrow-128.png' />
  </Components.Button>
)

ReactDOM.render(
  <ButtonWithIcon />,
  document.getElementById('root')
)
```

Конкретный пример использования можно найти, к примеру, в UI-фреймворке Ant Design: https://ant.design/components/select/

Здесь внутри селекта есть Option'ы. То есть такой синтаксис удобен для группипровки компонентов.

===

Не забывайте, что компоненты должны называться обязательно с большой буквы. Дело в том, что после Babel-преобразования, то что названо с маленькой буквы, в createElement превратится в строку, а то что с большой - в переменную.

В JS-коде компонентов можно легко присваивать переменным JSX-разметку, так как в итоге это все равно превратится в вызовы createElement.

```
const hello = _ => <div>Hello!</div>

// Все сломалось =( , ведь тега <hello> в браузере нет
const HelloWorld = _ => <hello />
```

```
const Hello = _ => <div>Hello!</div>

// А так - все работает
const HelloWorld = _ => <Hello />
```

===

Если вы хотите чтобы имя компонента выбиралось в коде динамически, в зависимости от вычисления какого-либо выражения, нужно сначала создать переменную с заглавной первой буквой и туда присвоить значение выражения, а затем уже использовать это в JSX-разметке. И почему это так, вы уже теперь понимаете.

```
const Login = _ => <div>Login</div>
const Dashboard = _ => <div>Dashboard</div>

const pages = {
  login: Login,
  dashboard: Dashboard
}

// Неверно! React-компонент нельзя называть с маленькой буквы!
const CurrentPage = props => <pages[props.activePage] userName={props.userName} />
```

```
const Login = _ => <div>Login</div>
const Dashboard = _ => <div>Dashboard</div>

const pages = { login: Login, dashboard: Dashboard }

// А вот тут все будет нормально
const CurrentPage = props => {
  const CurrentPage = pages[props.activePage]
  return <CurrentPage userName={props.userName} />
}

ReactDOM.render(
  <CurrentPage activePage='login' userName='User' />,
  document.getElementById('root')
)
```

===

Пропсы же, в отличие от имен компонентов, легко вычисляются - просто в фигурных скобках надо написать то, что вам нужно. Вариант записи значения пропса через строку и через строку в фигурных скобках, эквивалентны. А если пропс передан вообще без какого-либо значения, то он считается булевым и становится равным true. Это часто используется и очень удобно.

Часто имя класса, скажем, выбирается исходя из состояния определенных значений, переданных через пропсы или имеющихся в стейте.

Если же нужно в JSX-коде выполнить тот или иной кусок кода, в зависмости от условия, воспользуйтесь тернарным оператором, заключенным в фигурные скобки.

```
const Header = props => (
  <div className={props.darkTheme ? 'dark' : 'light' }>
    {props.userName
      ? `Привет, ${props.userName}`
      : <button>Войти</button>
    }
  </div>
)

<Header darkTheme userName='Олег' />
```

===

Если у вас есть объект с пропсами, которые нужно передать в компонент, то вместо того, чтобы делать это вручную, можно просто воспользоваться оператором spread (от англ. распространять в смысле размазывать, распылять), это три точки.

```
<Header {...headerProps} />
```

Также можно вычленять из объекта нужные пропсы, а остальные оставлять "пачкой".

```
const headerProps = {
  darkTheme: false,
  userName: 'Олег',
  isMobile: true,
  menuItems: [
    { title: 'Главная', link: '/' },
    { title: 'Каталог товаров', link: '/products' },
    { title: 'Контакты', link: '/contacts' }
  ]
}

const Menu = props => {
  return props.isMobile
    ? <div>🍔</div>
    : <ul>{props.menuItems.map(item => <li><a href={item.link}>{item.title}</a></li>)}</ul>
}

const UserArea = props => {
  return <div style={{ color: 'red', padding: '0 30px' }}>
    {props.userName ? `Привет, ${props.userName}` : <button>Войти</button>}
  </div>
}

function Header(props) {
  const { darkTheme, ...restHeaderProps } = props

  return (
    <div className={'header' + (props.darkTheme ? ' dark' : ' light')}>
      <Menu {...restHeaderProps} />
      <UserArea {...restHeaderProps} />
    </div>
  )
}

ReactDOM.render(
  <Header {...headerProps} />,
  document.getElementById('root')
)
```

Здесь мы вытаскиваем darkTheme, а остальное помещаем в restHeaderProps и передаем во вложенные в хедер компоненты. Пример очень условный, но суть передает.

С расSPREADиванием пропсов стоит быть аккуратным, так как можно передать лишние пропсы или невалидные HTML-аттрибуты в DOM-дерево.

===

Далее, есть такое свойство, которое мы уже ранее использовали - props.children в том примере выше. Все, чтобы было внутри Button, мы помещали вместо props.children, а в том случае там была иконка, которая могла меняться в зависимости от того, нарисуем мы кнопку со статической иконкой или, например с прелоадером, информирующем о загрузке файла на сервер или сохранении данных формы.

Другим ярким примером является модальное окно. Мы один раз создаем компонент модалки и далее можем помещать внутрь него совершенно так же любое содержимое, что чрезвычайно удобно.

```
const Modal = props => (
  <div className='modalWrapper'>
    {props.children}
  </div>
)

const ModalWithContent = props => (
  <Modal>
    <h1>{props.header}</h1>
    {props.children}
  </Modal>
)
```

Еще один момент - можно возвратить в методе render массив из элементов, и не будет необходимости их оборачивать в дополнительный элемент:

```
const ArrayRet = _ => {
  return [
    <li>1</li>,
    <li>2</li>,
    <li>3</li>
  ]
}

ReactDOM.render(
  <ArrayRet />,
  document.getElementById('root')
)
```

Хотя иной вариант это воспользоваться компонентом React.Fragment, делающим то же самое. Или его сокращенной версией <></>, которая правда поддерживается лишь с определенной версии Babel.

===

В JSX, как вы уже знаете, можно внутри разметки писать любые выражения Javascript, просто обрамляя их фигурными скобками. Например, можно что-то посчитать, или сконкатенировать нужным образом строку. Этим мы занимались, когда например через map, выводили список элементов в разметку:

```
function CitiesList() {
  const cities = ['Москва', 'Брянск', 'Новосибирск']

  return (
    <div>
      <select>
        {cities.map(city => (
          <option>г.{city}</option>
        ))}
      </select>
    </div>
  )
}

ReactDOM.render(
  <CitiesList />,
  document.getElementById('root')
)
```

Разумеется, можно смешивать фигурные скобки и выражения в них с обычным текстом, что очень удобно в работе.

===

Вот еще занимательный пример из документации Реакта:

```
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  )
}

ReactDOM.render(
  <ListOfTenThings numTimes={10} />,
  document.getElementById('root')
)
```

Здесь есть компонент Repeat, который умеет повторять то, что в него было передано качестве дочерних элементов, количество раз, переданное в пропсе numTimes. Функция внутри Repeat возвращает div с index, вставленным в соответствующие позиции. В самом же компоненте Repeat, цикл for запускается numTimes раз и рисует чилдрена. Точнее формируется массив, который в итоге и возвращаеся из Repeat.

Рекомендую этот пример разобрать с дебаггером. Если не очень хорошо им владеете, то рекомендую ознакомиться - ссылки на ролики по девтулзам Хрома оставлю в описании.

===

false, null, undefined и true - валидные значения внутри JSX, но вместо них просто рисуется ничего. Это удобно для отрисовки тех или иных штук в зависимости от условия:

```
<div>
  {isAuth && <Dashboard />}
</div>
```

Тут в заисимости от залогиненности юзера, мы показываем или нет, дэшборд. Если isAuth равно false, то просто ничего не отрисуется.



=============
React без JSX
=============

Давайте теперь посмотрим на разницу между современным синтаксисом и тем, что было ранее в плане создания компонентов. Это нужно, чтобы вы, увидев старый вариант, не впали в ступор.

Как мы создаем компоненты сейчас? Обычно классами, если нам нужен максимальный функционал:

```
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Но ранее для этих целей существовала функция createReactClass:

```
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>;
  }
});
```

Она принимает объект, ключами которого являются свойства и метода компонента.

===

Пропсы по умолчанию для компонента устанавливаются статическим свойством defaultProps. Напомню, что "статический" в случае компонента, означает что это поле будет доступно без его (компонента) инстанцирования.

```
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary'
}
```

С createReactClass иначе:

```
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Mary'
    }
  },

  // ...

})
```

Нужно объявить метод getDefaultProps и возвратить из него объект. Поля его и будут пропсами по умолчанию.

===

Начальный стейт в классе задается либо в виде поля, либо присвоением объекта полю this.state в конструкторе.

```
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }

  // или

  this.state = {count: props.initialCount}
}
```

В createReactClass для этого же служит метод getInitialState:

```
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount}
  },
  // ...
})
```

===

Как известно, классы для методов, выполняющихся как обработчики тех или иных событий, теряют связь с классом, потому что их this указывает на ноду, на которой событие произошло. Но в обработчике часто нужно вызывать другие методы компонента, так что this неплохо бы было сохранить. Для исправления этой ситуации, привязыают контекст this.

В ES6-варианте это выглядит так:

```
class SayHello extends React.Component {
  constructor(props) {
    super(props)
    this.state = {message: 'Hello!'}
    // This line is important!
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    alert(this.state.message)
  }

  render() {
    // Because `this.handleClick` is bound, we can use it as an event handler.
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    )
  }
}
```

Тут мы привязали к handleClick контекст this и даже при использовании в качестве обработчика клика, указатель на класс компонента не затрется.

А вот вариант с createReactClass:

```
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Hello!'}
  },

  handleClick: function() {
    alert(this.state.message)
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    )
  }
})
```

Все выглядит похоже, но она сама беспокоится про привязки, что очень удобно.

В новых версиях Babel поддерживается синтаксис стрелочных методов (хотя официально это называется Class Properties). Я уже об этом ранее говорил. В них в классах компонентов ручная привязка контекста не нужна - они его не теряют, так как это свойство стрелочных функций.

```
class SayHello extends React.Component {
  constructor(props) {
    super(props)
    this.state = {message: 'Hello!'}
  }
  // WARNING: this syntax is experimental!
  // Using an arrow here binds the method:
  handleClick = () => {
    alert(this.state.message)
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    )
  }
}
```

===

И еще одна штукенция - миксины. Однако этот функционал не рекомендуется использовать при разработке, что явно отражено в доках. Поэтому просто для общего развития поймем что это.

Вот у нас есть миксин SetIntervalMixin. Он говорит, что когда компонент будет маунтится, нужно в this.intervals поместить пустой массив, то есть инициализировать. А при уничтожении инстанса надо для всех идетификаторов таймеров счетчики в памяти очистить. setInterval же будет пушить в массив this.intervals ID счетчика, который вернет вызов setInterval. apply здесь нужен лишь для того, чтобы передать все аргументы метода this.setInterval в реальную JS-функцию setInterval, не более. Получается, что этим методом можно внутри компонента запускать столько независимых счетчиков, сколько нужно.

Ну и далее, при создании компонента, в специальном поле mixins мы передаем массив миксинов. Если их там будет несколько и у них будут совпадающие по имени методы, то гарантируется что все они будут выполнены, причем в том порядке, в котором стоят в массиве. То есть одни другими не перезапишутся.

Ну и далее в компоненте происходит вызов примешанного (ведь mix in можно дословно перевести как "примешанный в"), метода this.setInterval. Его аргументы попадают сюда, в метод setInterval и в итоге все работает как надо. Кстати, это счетчик, который каждую секунду выводит на экран вот эту надпись, при каждом тике обновляя стейт. Разберитесь с этим примером полностью самостоятельно. Для практики.



=============
Заключение
=============

На этом закончим данный урок и продолжим изучать Реакт в следующем. Удачного кодинга.
