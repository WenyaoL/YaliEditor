import {ElRow,ElCol,ElAutocomplete} from 'element-plus'
import {createApp} from 'vue/dist/vue.esm-bundler.js'
import {langCanload} from './lang'
import {CodemirrorManager} from './index'
interface LangItem {
  name: string
  icon: string
}

export let component = {
  components:{
    ElRow,
    ElCol,
    ElAutocomplete
  },
  props:{
    codemirrorManager:CodemirrorManager,
    editorId:String,
    langName:String
  },
  data() {
      return {
          lang:langCanload,
          state:''
      }
  },
  mounted() {
    this.state = this.langName
  },
  methods: {
      querySearch(queryString: string, cb: any){
          const results = queryString
            ? this.lang.filter(this.createFilter(queryString))
            : this.lang
          // call callback function to return suggestions

          cb(results)
      },
      createFilter(queryString: string){
          return (lang: LangItem) => {
            return (
              lang.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
            )
          }
      },
      handleSelect(item: LangItem){
        this.state = item.name
        let cmm:CodemirrorManager = this.codemirrorManager
        cmm.updatedLang(item.name,this.editorId)
      }
  },
  template:/*html*/`
                    <el-autocomplete :lang="state" v-model="state" :fetch-suggestions="querySearch" clearable class="inline-input w-50" placeholder="Please Input" @select="handleSelect">
                      <template #default="{ item }">
                        <div class="value">{{ item.name }}</div>
                      </template>
                    </el-autocomplete>
                        `,
}


export function mount(root:string | Element,rootProps?:Object){
  createApp(component,rootProps).mount(root)
}