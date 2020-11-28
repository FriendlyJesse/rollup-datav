import Icon from './components/Icon'
import Loading from './components/Loading'
import FlyBox from './components/FlyBox'
import AutoContainer from './components/AutoContainer'
import LogoAnimation from './components/LogoAnimation'
import VueCountTo from './components/VueCountTo'
import VueEcharts from './components/VueEcharts'

export default function(Vue) {
  Vue.use(Icon)
  Vue.use(Loading)
  Vue.use(FlyBox)
  Vue.use(AutoContainer)
  Vue.use(LogoAnimation)
  Vue.use(VueCountTo)
  Vue.use(VueEcharts)
}