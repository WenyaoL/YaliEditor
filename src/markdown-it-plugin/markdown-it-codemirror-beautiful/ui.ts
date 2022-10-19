/**
 * 选择控件
 * @author liangwy
 */
 class SearchSuggestUI{

    public root:HTMLElement;
    public inputE:HTMLElement;
    public suggest:HTMLElement;
    public suggestList:HTMLElement;
    public searchList:string[];
    public selectedIndex:number;
    


    /**
     * 动态的方式bind
     * @param element 
     * @param searchList 
     */
    bindSearchSuggest(element:HTMLElement,searchList:string[]){
        this.root = element;
        this.suggest = document.createElement("div")
        this.suggest.classList.add("suggest")
        this.suggestList = document.createElement("ul")

        this.inputE = document.createElement("div")
        this.inputE.classList.add("tooltip-input")
        this.inputE.classList.add("md-hiden")
        this.inputE.setAttribute("contenteditable","true");
        this.inputE.setAttribute("placeholder","选择语言")

        this.root.appendChild(this.inputE)
        this.root.appendChild(this.suggest)

        this.searchList = searchList;
        this.suggest.appendChild(this.suggestList)
        this.suggest.style.display="none"
        
        //输入事件绑定
        this.inputE.addEventListener("input",()=>{
            
            this.selectedIndex = -1;
            const search = new RegExp("^" + this.inputE.innerText.trim(),"i")
            //清空当前suggestList
            this.suggestList.innerHTML = ""
            this.searchList.forEach(str => {
                //正则匹配
                if(str.search(search)>=0){

                    //创建suggestList
                    const li = document.createElement("li")
                    li.innerText = str
                    this.suggestList.appendChild(li)

                    this.suggest.style.display="block"
                }
            });
        })

        this.inputE.addEventListener("blur",()=>{
            this.suggest.style.display="none"
        })


        this.inputE.addEventListener("keydown",(event)=>{
            //滑动头部位置
            const top = this.suggest.scrollTop
            //滑动块长度
            const height = this.suggest.scrollHeight

            // 键盘向下事件
            if(event.keyCode === 40){
                //滚动top


                if(this.selectedIndex<this.suggestList.children.length-1){
                    const node = this.suggestList.children.item(this.selectedIndex) as HTMLElement
                    if(node) {
                        node.classList.remove("activate")
                        //调整滑动高度
                        if(top + node.clientHeight > height){
                            this.suggest.scrollTop = height
                        }else{
                            this.suggest.scrollTop = top + node.clientHeight
                        }
                            
                    }
                    this.selectedIndex +=1;
                    this.suggestList.children.item(this.selectedIndex).classList.add("activate")
                    

                }
                event.preventDefault()
            }
            
            // 键盘向上事件
            if(event.keyCode === 38){
                if(this.selectedIndex>0){
                    const node = this.suggestList.children.item(this.selectedIndex)
                    if(node){
                        node.classList.remove("activate")
                        //调整滑动高度
                        if(top <= 0){
                            this.suggest.scrollTop = 0
                        }else{
                            this.suggest.scrollTop = top - node.clientHeight
                        }
                    }
                    
                    this.selectedIndex -=1;
                    this.suggestList.children.item(this.selectedIndex).classList.add("activate")
                }
                event.preventDefault()
            }

            //回车事件
            if(event.keyCode=== 13){
                const select = this.suggestList.children.item(this.selectedIndex)
                if(select){
                    const lang = select.textContent
                    this.inputE.textContent = lang;
                    this.suggest.style.display="none"
                }


                event.preventDefault()
                event.stopPropagation()
            }


        })
    }
}

export default SearchSuggestUI;