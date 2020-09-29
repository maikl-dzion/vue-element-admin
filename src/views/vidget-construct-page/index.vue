<template><div class="tab-container">
  <div class="mixin-components-container">

    <el-row style="margin-top:0px;"><el-col><el-card class="box-card">

      <div class="clearfix" style="text-align: left; margin-bottom: 10px; font-style: italic">
        Выбрать тип виджета
      </div>

      <div class="clearfix" style="padding:0px; margin-bottom: 10px">
        <template v-for="(vidget, vname) in vidgetTypeList">
          <div
            class="text-center el-col el-col-2"
            style="width:17%; margin-right:10px;"
            draggable="true"
            @dragstart="dragStart($event, vname)"
            @dragend="dragEnd($event)">
            <a class="pan-btn blue-btn"
               style="width: 100%; border-radius: 0px"> {{ vidget['description'] }} </a>
          </div>
        </template>
      </div>

    </el-card></el-col></el-row>

    <el-row style="margin-top:0px;">

      <el-col :span="5">
        <el-card class="box-card">
          <div class="clearfix" style="padding:0px; margin-bottom: 10px">
            <div class="text-center el-col el-col-40" style="width: 100%;">
              <a class="pan-btn light-blue-btn" style="width: 100%; border-radius: 0px"
                 @click="addNewDesktop()"> Создать рабочий стол</a></div>
          </div><hr>

          <div class="clearfix" style="text-align: center; margin-bottom: 10px">
             Список рабочих столов
          </div><hr>

          <!--<pre>{{desktopId}}</pre>-->

          <div class="component-item" style="height:420px;">
            <div v-for="(desktop, index) in desktopList"
                 @click="getDesktopItem(desktop.id)"
                 style="margin:3px; border-bottom: 1px grey solid; cursor: pointer">
                 {{ desktop.title }}
            </div>
          </div>
        </el-card>
      </el-col>


      <template v-if="openNewDesktop || openEditDesktop">
        <el-col :span="19">
          <el-card class="box-card">
            <div class="clearfix" style="text-align: center; margin-bottom: 10px">
              Рабочий стол:{{ desktopLabel }}
            </div><hr>

            <div style="display: flex; margin-bottom:10px;">

              <div style="width:40%" >
                <label for="desktop-title" style="font-size: 14px; font-style: italic">Наименование</label><br>
                <input id="desktop-title" v-model="desktopTitle" style="border: 1px gainsboro solid"><br>
              </div>

              <div style="width:30%" >
                <!--drop-state :{{ dragOverState }} <br>-->
                <!--selected-name : {{ selectedVidgetName }} <br>-->
              </div>

              <div style="width:30%">
                  <a class="pan-btn green-btn"
                     style="width: 100%; text-align:center; border-radius: 0px; padding:10px;"
                     @click="saveDesktop()" > Сохранить рабочий стол </a>
              </div>

            </div>

            <div
              class="drop-container"
              style="height:464px; border:2px grey dotted"
              @drop="dropStop($event)"
              @dragover="dragOverRun($event)"
              @dragleave="dragLeave($event)" >

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

            <div class="text-center el-col el-col-40"
                 style="width: 100%; margin:10px 0px 10px 0px;" ></div>

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

  name: 'ConstructVidget',

  components: {
    // draggable,DragComponent,PanThumb,MdInput,Mallki,DropdownMenu,TabPane,
  },

  mixins: [DragService],

  data() {

    const hostName   = 'http://bolderfest.ru';
    const apiUrl     = hostName + '/faximile/api/public/iac/dashboard';

    return {
      // apiUrl : 'http://172.16.16.234/iac_dashboard/public/api',
      apiUrl : apiUrl,
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

    async getDesktopItem(itemId) {
        this.editDesktop();
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
