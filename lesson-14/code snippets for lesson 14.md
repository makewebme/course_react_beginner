===================
Урок 14. Паттерны "композиция" и "наследование". Компоненты высшего порядка.
===================

Всем привет. Документация Реакта активно призывает использовать паттерн "композиция" (composition) в противоположность паттерну "наследование" (inheritance).

Давайте разберемся в двух этих вещах. Наследование это то, что в объектно-ориентированном программировании означает буквально наследование одного класса другим.

Например, есть сущность автомобиль. Отразим ее классом Car. У автомобиля есть колеса и обычно их 4, хотя в грузовике может быть и 6, а с прицепом и того больше. Но изначально будет 4. Это будет определять свойство wheelsCount. У каждого автомобиля также как минимум есть функция завести/заглушить мотор. Это два метода вот тут. Метод это как функция, только внутри класса. Есть размеры (ширина/высота/длина), цвет, марка и модель. Все это пока не определено. Нужен также конструктор. Он тут будет пустой.

Дальше определяем класс Truck - грузовик и он наследует (в JS для этого есть ключевое слово extends) класс Car. Это значит, что все, что было определено в Car, перейдет и в Truck. В нем мы описываем свойство withTrailer, сигнализирующее о том, есть ли прицеп у этого грузовика или нет. По умолчанию нет. И пишем конструктор. Там мы вызываем родительский конструктор, то есть конструктор Car. Это обязательно, поэтому я в Car создал пустой. Метод super() вызывает как раз конструктор родителя. Ну а потом мы просто берем все, что было передано в конструктор и присваиваем одноименным полям в инстансе через ключевое слово this.

Надо заметить, что класс это как чертеж детали, а инстанс или иначе экземпляр, это как конкретное изделие, воплощенное в материале. Так вот, ничего не будет, пока мы не вызовем класс через new. Так и делаю, передавая сюда в том же порядке, как описано в конструкторе, все значения - размеры в виде объекта, количество колес, марка, модель и есть ли прицеп.

Все, в переменной mercedesActros лежит конкретная модель грузовика Mercedes с конкретными значениями свойств. Вот тут все методы этого экземпляра класса Truck, которые в свою очередь наследованы от более общего класса Car. Можно завести мотор и тогда свойство engineWorking станет true.

А далее мы можем создать класс SpecialCar, наследующий опять от Сar и это уже будет спецтехника, скажем. Пофантазируйте на эту тему. Преимущество в том, что с каждым следующим наследованием, методы и свойства суммируются и даже перезаписываются. Тем самым мы формируем древовидную структуру зависимости более специфичных классов от более общих. Это и есть суть паттерна "наследование".

Мы тут залезли в детали ООП. Тема обширная, и заслуживает не просто отдельного ролика, а целой серии. Но суть явления, думаю я вам передал.

```
class Car {
    constructor() {}

    engineWorking = false

    startEngine() {
        this.engineWorking = true
    }

    drownOutEngine() {
        this.engineWorking = false
    }

    dimensions
    wheelsCount = 4
    color
    mark
    model
}

class Truck extends Car {
    constructor(dimensions, wheelsCount, color, mark, model, withTrailer) {
        super()
        this.dimensions = dimensions
        this.wheelsCount = wheelsCount
        this.color = color
        this.mark = mark
        this.model = model
        this.withTrailer = withTrailer
    }

    withTrailer = false
}

let mercedesActros = new Truck({ width: 3, height: 3, length: 10 }, 6, 'red', 'Mercedes', 'Actros', true)

console.log(mercedesActros)
```

Эту концепцию можно перенести и на React-компоненты. Кстати, вы всегда используете в React наследование, когда пишете компонент, объявленный как класс, потому что наследуете от базового React.Component. Это, в частности, позволяет через this вызывать метод setState(). Это работает именно благодаря наследованию одних классов другими.

===

Используя это знание, мы можем создать компонент модалки и отнаследовать от него какую-то специфическую модалку.

CSS:
```
body {
    margin: 0;
}

.modal {
    position: fixed;
    background-color: rgba(0,0,0,.5);
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
}

.inner {
    padding: 30px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: table;
}

.close {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
}
```

JS:
```
// Modal
class Modal extends React.Component {
    closeModal = e => {
        if (e.target.dataset.closer) {
            this.props.closeHandler()
        }
    }

    render() {
        const { children, closeHandler } = this.props

        return (
            <div className='modal' data-closer onClick={this.closeModal}>
                <div className='inner'>
                    <div className='close' data-closer onClick={this.closeModal}>X</div>
                    {children}
                </div>
            </div>
        )
    }
}

// App
class App extends React.Component {
    state = {
        modalVisible: false
    }

    showModal = _ => this.setState(_ => ({ modalVisible: true }))
    hideModal = _ => this.setState(_ => ({ modalVisible: false }))

    render() {
        const { modalVisible } = this.state

        return (
            <div>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>

                <button onClick={this.showModal}>Show modal</button>

                {modalVisible && (
                    <Modal closeHandler={this.hideModal}>
                        <h2>I'm simple modal</h2>
                    </Modal>
                )}
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'))
```

Итак, у нас есть вот такой код, который простейшую модалку и рисует.

Класс Modal. Он рисует, собственно, модалку и вешает на ее затемненную часть и кнопку с крестиком действие закрытия. Если то, по чему мы кликнули, имеет атрибут data-closer, то модалку закрываем. Внутри рисуем children, который как и обработчик закрытия передается сверху, вот здесь в классе App. Вот children, а вот closeHandler, делающий setState. В зависимости от того, true или false modalVisible, мы или показываем модалку или нет. Все просто. Со стилями, думаю, сами разберетесь.

Хорошо, а вот код, создающий модалку, предназначенную для просмотра информации о пользователе.

```
// Modal
class Modal extends React.Component {
    closeModal = e => {
        if (e.target.dataset.closer) {
            this.props.closeHandler()
        }
    }

    render() {
        const { children, closeHandler } = this.props

        return (
            <div className='modal' data-closer onClick={this.closeModal}>
                <div className='inner'>
                    <div className='close' data-closer onClick={this.closeModal}>X</div>
                    {children}
                </div>
            </div>
        )
    }
}

// Modal with random user
class ModalRandomUser extends Modal {
    state = {
        randomUserData: null
    }

    fetchRandomUser = _ => {
        fetch('https://randomuser.me/api')
            .then(res => res.json())
            .then(randomUserData => this.setState({ randomUserData }))
    }

    componentDidMount () {
        this.fetchRandomUser()
    }

    render() {
        if (!this.state.randomUserData) return null

        const { picture } = this.state.randomUserData.results[0]

        return (
            <div className='modal' data-closer onClick={this.closeModal}>
                <div className='inner'>
                    <div className='close' data-closer onClick={this.closeModal}>X</div>
                    <img src={picture.large} alt='' />
                </div>
            </div>
        )
    }
}

// App
class App extends React.Component {
    state = {
        modalVisible: false
    }

    showModal = _ => this.setState(_ => ({ modalVisible: true }))
    hideModal = _ => this.setState(_ => ({ modalVisible: false }))

    render() {
        const { modalVisible } = this.state

        return (
            <div>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>

                <button onClick={this.showModal}>Show modal</button>

                {modalVisible && <ModalRandomUser closeHandler={this.hideModal} />}
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'))
```

Она называется ModalRandomUser и наследует все, что умеет Modal. Соответственно, эту модалку не надо "учить" закрываться. Вот тут видите, я написал this.closeModal, хотя здесь в классе нет метода closeModal. Зато он имеется в классе-родителе, от которого мы производим наследование. Так это и работает.

Затем я переопределяю метод render() и там рисую содержимое в виде самой обертки-модалки с изображением случайного пользователя. А берутся данные от того, что при маунтинге ModalRandomUser мы делаем запрос вот сюда и получаем данные о пользователе. Каждый раз разные. Это сервис такой. Удобен для тестирования. Тут вам уже должно быть все понятно, потому что вы конечно же хорошо разобрали все предыдущие уроки =)

Это немного высосанный из пальца, что называется, пример, но он показывает работу наследования. Так вот, предпочтительным и наиболее часто употребляемым для среды React является именно метод композиции, о чем говорят разработчики из Фейсбука, которым пришлось написать тысячи самых разных компонентов. Поэтому давайте разберем теперь композиционный подход к решению той же задачи.

===

Что вообще такое композиция? Это слово употребляется в разных предметных областях. В художественном искусстве это взаимное расположение предметов в пространстве. В Реакте же это означает, что один компонент, грубо говоря передается в другой. Это довольно условно, потому что необязательно именно КОМПОНЕНТ должен передаться в компонент.

Проще будет написать код и все прояснится.

```
// Modal
class Modal extends React.Component {
    closeModal = e => {
        if (e.target.dataset.closer) {
            this.props.closeHandler()
        }
    }

    render() {
        const { children, closeHandler } = this.props

        return (
            <div className='modal' data-closer onClick={this.closeModal}>
                <div className='inner'>
                    <div className='close' data-closer onClick={this.closeModal}>X</div>
                    {children}
                </div>
            </div>
        )
    }
}

// Just random user
class RandomUser extends React.Component {
    state = {
        randomUserData: null
    }

    fetchRandomUser = _ => {
        fetch('https://randomuser.me/api')
            .then(res => res.json())
            .then(randomUserData => this.setState({ randomUserData }))
    }

    componentDidMount () {
        this.fetchRandomUser()
    }

    render() {
        if (!this.state.randomUserData) return null

        const { picture } = this.state.randomUserData.results[0]

        return <img src={picture.large} alt='' />
    }
}

// App
class App extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        modalVisible: false
    }

    showModal = _ => this.setState(_ => ({ modalVisible: true }))
    hideModal = _ => this.setState(_ => ({ modalVisible: false }))

    render() {
        const { modalVisible } = this.state

        return (
            <div>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>

                <button onClick={this.showModal}>Show modal</button>
 
                {modalVisible && (
                    <Modal closeHandler={this.hideModal}>
                        <RandomUser />
                    </Modal>
                )}
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'))
```

Здесь на самом деле минимум изменений. Modal остался точно таким же, а вот ModalRandomUser стал называться просто RandomUser и в render() содержит только возврат img со случайной аватаркой.

В методе же render() нашего приложения, мы буквально рисуем <RandomUser /> внутри <Modal> и все, ведь сделав так, мы превратим компонент случайной аватарки в this.props.children внутри Modal, а он-то там и выводится! Вот и вся композиция. Можно использовать свои пропсы, если вы хотите передать несколько разных компонентов внутрь одного. Напрмер, внутри модалки мог бы быть отдельный компонент футера, хедера и содержимого и за это могли бы отвечать три соответствующих пропса.

Вот примеры из документации.
Рисуем FancyBorder - просто div с оформлением границы. Затем создаем WelcomeDialog, где заголовок и параграф обертываются в FancyBorder и возвращаются. Все гениально просто.

SplitPane это две панели, как бы экран разделенный надвое. В левой части рисуем тот компонент, который был передан в пропс left, а в правой, соответственно, то что в props.right. А вот и вызов компонента.

И вот еще один пример такого пробрасывания через пропсы, но тут WelcomeDialog просто через пропсы пробрасывает текст для заголовка и сообщения, то есть Dialog это такой декоративный элемент, в свою очередь внутри себя использующий FancyBorder.

===

Как видите, композиция позволяет делать все то же самое, что и наследование, но отсутствует повторение кода, как у нас это было с Modal и ModalRandomUser, где пришлось всю разметку самой модалки писать заново. Ну и плюс композиция очень интуитивна и сразу показывает какой компонент внутри какого лежит.





=============
Компоненты высшего порядка
=============

А теперь рассмотрим так называемые "комопоненты высшего порядка" (Higher-Order Components или просто HOC, далее для простоты будем говорить ХОК), о них уже немного шла речь в предыдущих уроках, а сейчас пришло время разобраться в этом досконально.

В то время, как обычный компонент трансформирует пропсы в пользовательский интерфейс, компонент высшего порядка трансформирует один компонент в другой.

Вообще, это не часть Реакта, а подход, благодаря которому можно завернуть один компонент в другой. Чаще всего это делается при экспорте.

Так как любой компонент React это в сущности функция или класс, то и HOC это тоже функция, принимающая аргументом другой компонент, делающая с ним что-то (частенько это добавление пропсов) и возвращающая результат модификации.

Вот так вот в общем виде выглядит HOC:

```
const EnhancedComponent = higherOrderComponent(WrappedComponent)
```

В EnhancedComponent лежит наш обернутый компонент WrappedComponent, а higherOrderComponent это название вполне конкретной функции высшего порядка. Или так можно сделать:

```
export default higherOrderComponent(WrappedComponent)
```

Здесь по умолчанию экспортируется обернутый компонент.

Без функций высшего порядка не обходится использование такой популярной библиотеки менеджмента состояний, как Redux. Да и вообще, в мире Реакта без HOC не обойтись.

===

Зачастую есть необходимость переиспользовать одну и ту же логику в двух и более компонентах. Для этого давно уже в Реакте есть миксины, про которые мы говорили в предыдущих выпусках этой серии роликов. Однако использовать их не стоит, так как опыт выявил больше проблем, чем их решений. Поэтому вместо миксинов используйте функции высшего порядка. И вот как - пример из документации: 

```
https://reactjs.org/docs/higher-order-components.html#use-hocs-for-cross-cutting-concerns
```

Итак, есть вот такой компонент - список комментариев. В конструкторе у него создвется стейт с полем comments, значением которого по умочанию становится результат вызова метода getComments некого класса DataSource - он извне получает список комментариев, как явствует из названий. Это вызывается один раз.

Далее объявлен метод жизненного цикла componentDidMount, где происходит подписка на обновления DataSource и отписка от него в componentWillUnmount. В обоих случаях запускается метод handleChange, который изменяет стейт на результат очередного вызова DataSource.getComments(), когда данные приехали и готовы для использования. И это то же самое что в конструкторе, но позволяет постоянно синхронизировать данные о комментариях с DataSource. Ну и в рендере мы мэпимся по всем комментариям и каждый рисуем в своем компоненте Comment. Все достаточно просто.

Теперь другой компонент - он рисует пост из блога. Все очень похоже - берем пост из DataSource по id из пропсов. Подписываемся/отписываемся, забираем данные при изменении и рисуем, собственно, сам пост.

Между этими двумя компонентами есть большое сходство: на componentDidMount и componentWillUnmount выполняется подписка/отписка, а внутри handleChange - изменение стейта на актуальные значения. А ведь может быть и больше подобных компонентов. Поэтому очень актуально будет создать HOC, который бы реализовывал подписку/отписку и передачу полученных данных в компонент для отрисовки.

Если смотреть на оба этих компонента, то они почти идентичны - оба обращаются к DataSource, дергая, разные его методы. Сходство в том, что:
- при маунтинге мы подписываемся на изменения DataSource,
- внутри handleChange записываем прилетевшие новые данные в стейт,
- и на анмаунтинг - отписываемся от прослушки изменений DataSource.

Но что если кроме комментов и постов нам надо будет запрашивать еще список юзеров онлайн или еще что-то подобное? Каждый раз дублировать один и тот же компонент? Ну нет, лучше один раз написать HOC.

Итак, как вы уже догадались, мы будем наши компоненты оборачивать в функцию высшего порядка. Вот данный код. CommentListWithSubscription и BlogPostWithSubscription это уже обернутые версии компонентов CommentList и BlogPost. Они передаются первым аргументом внутрь функции-оборачивателя withSubscription. Вторым же аргументом прилетают колбэки с вызовом соответствующего метода получения данных на DataSource - для комментов это фукция, получающая аргуметом сущность, которая является источником данных, и возвращающая результат вызова метода для непосредственного получения данных. В случае постов мы еще и id поста должны передать, поэтому в аргументах есть еще объект props, в котором будет лежать нужный id. Заметьте, что сам DataSource может быть любым ранее подключенным классом, что еще больше универсализирует нашу HOC.

А вот код самого "оборачивателя" - withSubscription. Аргументы: оборачиваемый компонент и колбэк для получения данных, все соответствует вызову выше. И далее мы сразу возвращаем новый компонент-класс. В нем есть стейт с полем, куда будут полученные данные складываться - это универсальное поле - что для постов, что для комментов, что для чего еще угодно. В методах жизненного цикла мы подписываемся НА и отписываемся ОТ изменений DataSource. handleChange сет-стейтит полученные данные, вызывая перерендер. Помните, что selectData  это переданный колбэк? А WrappedComponent это переданный компонент. В него передается полученные данные в пропс data и все остальные переданные пропсы тоже транслируются.

В итоге withSubscription работает универсально, с любым источником данных и оборачиваемым компонентов, что чрезвычайно удобно и гибко.

Просто подумайте над этим кодом и все встанет на свои места. Кстати, в DevTools React'а при использовании HOC вы всегда будете видеть как вместо одного компонента появляется два, потому что один мы обертываем другим. Это кстати, определенное неудобство, особенно когда функций высшего порядка у нас используется много, например, в Redux, где мы кучу компонентов подключаем к стору с помощью HOC-функции connect. Код, знаете ли, захламляет.

Кстати, не забывайте, что функция-оборачиватель, в нашем примере withSubscription, должна писаться с маленькой буквы, так как это все ж таки функция, а не компонент. А еще она не модифицирует оригинальный компонент, а просто оборачивает. Это ведь тоже композиция, о которой мы тут ведем речь.

===

Не стоит внутри HOC менять прототип оборачиваемого компонента. Например, тут прикручивется логирование пропсов к проброшенному InputComponent. К его prototype добавляется метод componentWillReceiveProps. Который при получении новых пропсов выводит их в консоль, вместе со старыми. В итоге мы возвращаем модифицированный InputComponent.

Первая проблема тут в том, что InputComponent не может быть использован в оригинале внутри EnhancedComponent, а это может быть нужно. А вторая, более серьезная заключается в том, что если EnhancedComponent обернуть еще в одну подобную "мутирующую" HOC-функцию, и она будет также будет переопределять componentWillReceiveProps, то предыдущая версия этого метода просто затрется. Сами понимаетте, так проектировать функции высшего порядка нельзя.

Поэтому нормальный logProps будет примерно таким. Возвращаем класс, с методом componentWillReceiveProps где логируем пропсы и возвращаем оригинальный InputComponent, пробрасывая оригинальные же пропсы.

Кстати, вы можете заметить, что компоненты высшего порядка это компоненты-контейнеры, по терминологии Дэна Абрамова, создателя Redux (вот его статья https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0 с введением такой классификации). Презентационные компоненты также как и HOC оборачивают презентационные компоненты, реализуя тот или иной функционал и обвес. Но HOC и контейнеры-компоненты это не одно и то же.

Не забывайте с помощью оператора rest (три точки) пробрасывать оставшиеся пропсы внутрь оригинального компонента, иначе он их не получит и, скорее всего, будет работать неверно.

===

Композиция может быть достаточно сложной. Вот тут мы просто передаем в "оборачиватель" withRouter компонент Navbar и на выходе получаем обернутый NavbarWithRouter.

Здесь уже оборачиваемый компонент и некий конфиг.

А тут вообще нечто несуесветное.. Что это вообще? Все не так сложно и достаточно логично.
connect(commentListSelector, commentListActions) возвращает другую HOC-функцию, которая и оборачивает итоговый CommentList. Можно даже сказать, что вызов connect возвращает КОМПОНЕНТ высшего порядка.

===

Те компоненты-обертки, которые возвращаются из HOC-функций, для удобства отладки в девтулзах Реакта можно пометить именем. Для этого, создавая "функцию-оборачиватель", нужно на нее прицепить свойство displayName, как в примере вот тут. И тогда в девтулзе в дереве компонентов мы увидим WithSubscription и в скобках имя обернутого компонента. Само имя берется из оборачиваемого компонента там же в displayName, потом в name, если предыдущее null, и если уж нигде нет, пишем просто Component. Удобно.

===

Мы почти подошли к концу. Напоследок, еще пара предостережений.

Первое. Не используйте HOC-функции внутри метода render(). Дело в механизме сверки (reconciliation) React. Если возвращается тот же компонент, то сравниваются на предмет изменений и перерисовываются лишь некоторые его внутренние ноды. А если из render возвращается обернутый компонент, то мы каждый раз рисуесм компонент с нуля. При этом стирается и внутреннее его состояние - стейт. Поэтому мы всегда возвращаем определение компонент, обернутое в функцию высшего порядка - так будет все отрабатывать нормально.

Второе. Если оборачиваемый компоненент имеет статические методы и вы хотите продолжать ими пользоваться, нужно предусмотреть их копирование в компонент-обертку. Статическими называются те методы, которые доступны без создания экземпляра. Например, вот тут у WrappedComponent есть staticMethod, но после применения HOC, он станет недоступен. Поэтому enhance должен не только скопировать статические методы в обертку, но еще и знать какие именно нужно скопировать. hoist-non-react-statics в этом может помочь и позволяет выявить все НЕреактовские статические методы. Ну или можно в самом компоненте экспортировать отдельно от него статические методы. Как вариант.

И третье. Рефы не пробрасываются в обернутый компонент автоматически, потому что это это особый зарезервированный пропс, обрабатываемый Реактом не менее особенно. В итоге, реф будет указывать на обертку, а не на обертываемый компонент. И тут помогает React.forwardRef - в предыдущих сериях мы уже про это говорили - пересмотрите урок номер 12. Там об этом подробнейшим образом рассказано.
