const files = require.context('@/pages/mobile/mViews/components', true, /describe.json$/)
const components = []
files.keys().forEach((key) => {
  console.log('123456789123', key)
  components.push({
    describe: require(`@/pages/mobile/mViews/components${key.slice(1)}`),
    imgUrl: require(`@/assets/mobile/list-pic/${key.slice(2).split('/')[0]}.png`) || 'https://img01.yzcdn.cn/vant/ipad.jpeg'
  })
})
const componentsLibrary = {
  state: {
    components: components
  },
  mutations: {

  },

  actions: {
  }
}
export default componentsLibrary
