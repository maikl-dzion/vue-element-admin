<template><div class="tab-container">
  <div class="mixin-components-container">

    <el-row style="margin-top:0px;">

      <template v-if="desktopStatus == 'menu_list'">

        <el-col :span="5" >
          <el-card class="box-card">
            <div class="clearfix" style="text-align: center; margin-bottom: 10px">Выбрать рабочий стол</div><hr>
            <div class="component-item" style="height:420px;">
              <div v-for="(desktop, index) in desktopList"
                   @click="desktopItemOpen(desktop.id)"
                   style="margin:3px; border-bottom: 1px grey solid; cursor: pointer">
                   {{ desktop.title }}
              </div>
            </div>
          </el-card>
        </el-col>

      </template>
      <template v-else >

        <el-col :span="24">
          <el-card class="box-card">
            <div class="clearfix" style="text-align: center; margin-bottom: 10px">Рабочий стол оператора</div><hr>
            <div class="component-item" style="height:100%">

              <div class="drop-container" style="height:464px; border:2px grey dotted" >

                <template v-for="(vidget, index) in desktopVidgetList">
                  <div
                          :class="'vidget-item-box item__' + vidget.name"
                          :style="'margin-left:' + vidget.pos.left + 'px; ' +
                      'margin-top:' + vidget.pos.top +'px;'"
                          draggable="true"
                          @dragstart="dragStart2($event, index, vidget)"
                          @dragend="dragEnd2($event)">

                    {{ vidget.description }}
                    <div><i @click="deleteVidget(index, vidget)"
                            class="el-icon-delete" style="color:red; "/></div>
                  </div>

                </template>

              </div>

            </div>
          </el-card>
        </el-col>
      </template>


    </el-row>

  </div></div></template>

<script>

import DragService from '@/utils/drag-service';
import HttpService from '@/utils/http-request';

// import draggable from 'vuedraggable'
// import TabPane from './components/TabPane'
// import DragComponent from './components/DragComponent'
// import PanThumb from '@/components/PanThumb'
// import MdInput from '@/components/MDinput'
// import Mallki from '@/components/TextHoverEffect/Mallki'
// import DropdownMenu from '@/components/Share/DropdownMenu'
// import waves from '@/directive/waves/index.js'

export default {
  name: 'OperatorPage',
  components: {
    // draggable,DragComponent,PanThumb,MdInput,Mallki,DropdownMenu,TabPane,
  },

  mixins: [DragService],

  data() {

    const hostName   = 'http://bolderfest.ru';
    const apiUrl     = hostName + '/faximile/api/public/iac/dashboard';

    return {
      // apiUrl : 'http://172.16.16.234/iac_dashboard/public/api',
      desktopStatus : 'menu_list',

      apiUrl       : apiUrl,
      taskElements : [],
      tasksListElement : {},

      desktopId    : 0,
      desktopName  : '',
      desktopTitle : '',

      openNewDesktop : false,
      openEditDesktop: false,
      desktopLabel: 'создание',

      selectedVidgetName: '',

      desktopVidgetList: [],
      desktopList: [],

      vidgetTypeList: {

        table: {
          description: 'Виджет «Таблица»',
          type: 'object',
          properties: {}
        },

        chart: {
          description: 'Виджет «График»',
          type: 'object',
          properties: {}
        },

        calendar: {
          description: 'Виджет «Календарь»',
          type: 'object',
          properties: {}
        },

        notifications: {
          description: 'Виджет «Уведомления»',
          type: 'object',
          properties: {}
        }
      }
    }
  }, // --- end data

  watch: {},

  created() {
      this.getDesktopList();
  },

  mounted() {},

  methods: {

    saveDesktop(callback = null) {

        const url = 'http://bolderfest.ru/faximile/api/public/v1/post/iac/dashboard/desktop-save';

        const postData = {
          id      : this.desktopId,
          vidgets : this.desktopVidgetList,
          name    : this.desktopName,
          title   : this.desktopTitle
        }

        HttpService({
           url: url,
           method: 'post',
           params: postData
        }).then(response => {
            if(callback) {
              callback(response);
            } else {
                if(response['save_result']) {
                  this.getDesktopList();
                } else {
                  alert('Не удалось сохранить');
                }
            }
        });
    },

    addNewDesktop() {
      this.desktopLabel = 'создание';
      this.clearDate();
      this.desktopVidgetList = [];
      this.openNewDesktop = true;
    },

    editDesktop() {
      this.desktopLabel = 'редактирование';
      this.clearDate();
      this.desktopVidgetList = []
      this.openEditDesktop = true
    },

    addNewVidget(vidget, name = null) {
      const item = Object.assign({}, vidget)
      this.desktopVidgetList.push(item)
    },

    deleteVidget(index, vidget) {

        delete this.desktopVidgetList[index];
        let items = Object.assign({}, this.desktopVidgetList);
        this.desktopVidgetList = [];
        for(let i in items) {
          this.desktopVidgetList.push(items[i]);
        }

    },

    getDesktopList() {
        const url = this.apiUrl + '/desktop-list';
        HttpService({
          url   : url,
          method: 'get'
        }).then(response => {
            this.desktopList = response;
        })
    },

    async desktopItemOpen(itemId) {
        this.desktopStatus = 'desktop_work'
        const url = this.apiUrl + '/desktop/' + itemId;
        const resp = await HttpService({ url : url, method: 'get'})
        this.desktopTitle = resp['title'];
        this.desktopId    = resp['id'];
        this.desktopVidgetList = [];
        for(let i in resp['vidgets']) {
            let item = JSON.parse(resp['vidgets'][i]);
            this.desktopVidgetList.push(item)
        }
    },

    clearDate() {
        this.desktopId = 0;
        this.desktopName = '';
        this.desktopTitle = '';
    },

  }

}
</script>

<style scoped>
    .tab-container {
        margin: 30px;
    }

    .vidget-item-box {
        width: 60px;
        height: 40px;
        border: 1px gainsboro solid;
        position: absolute;
        font-size: 13px;
    }

    .item__table{
        width: 120px;
        height: 50px;
    }

    .item__chart{
        height: 70px;
    }

    .item__notifications{

    }

    .item__calendar{

    }

</style>
