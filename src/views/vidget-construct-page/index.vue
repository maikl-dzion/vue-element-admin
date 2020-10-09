<template>
    <div class="tab-container">
        <div class="mixin-components-container">

            <!-- НАБОР ВИДЖЕТОВ -->
            <el-row style="margin-top:0px;">
                <el-col>
                    <el-card class="box-card">
                        <div class="clearfix"
                             style="text-align: left; margin-bottom: 10px; font-style: italic">Выбрать тип виджета</div>
                        <div class="clearfix" style="padding:0px; margin-bottom: 10px">

                            <template v-for="(widget, name) in widgetSchema.properties">
                                <div draggable="true"
                                     class="text-center el-col el-col-2"
                                     style="width:17%; margin-right:10px;"
                                     @dragstart="dragStart($event, name)"
                                     @dragend="dragEnd($event)">
                                     <a class="pan-btn blue-btn"
                                        style="width: 100%; border-radius: 0px"> {{ widget['description'] }} </a>
                                </div>
                            </template>

                        </div>
                    </el-card>
                </el-col>
            </el-row>

            <el-row style="margin-top:0px;">

                <!-- СПИСОК РАБОЧИХ СТОЛОВ -->
                <el-col :span="5">
                    <el-card class="box-card">
                        <div class="clearfix" style="padding:0px; margin-bottom: 10px">
                            <div class="text-center el-col el-col-40" style="width: 100%;">
                                <a class="pan-btn light-blue-btn" style="width: 100%; border-radius: 0px"
                                   @click="addNewDesktop()"> Создать рабочий стол</a>
                            </div>
                        </div>
                        <hr>

                        <div class="clearfix"
                             style="text-align: center; margin-bottom: 10px">Список рабочих столов</div>
                        <hr>

                        <div class="component-item" style="height:420px;">
                            <div v-for="(desktop, index) in desktopList"
                                 @click="getDesktopItem(desktop.id)"
                                 style="margin:3px; border-bottom: 1px grey solid; cursor: pointer">
                                {{ desktop.title }}
                            </div>
                        </div>
                    </el-card>
                </el-col>

                <!--- РАБОЧИЙ СТОЛ ---------->
                <template v-if="openDesktopState">
                    <el-col :span="19" >
                        <el-card class="box-card">
                            <!-- Заголовок рабочего стола -->
                            <div class="clearfix" style="margin-bottom: 5px; display: flex">
                                <div style="width: 15%;">Рабочий стол</div>
                                <div style="width:20%; border:0px red solid">
                                    <label for="desktop-title" style="width:100px; font-size: 14px; font-style: italic">Title</label><br>
                                    <input id="desktop-title" v-model="desktopItem.title"
                                           style="border:1px gainsboro solid; ">
                                </div>
                                <div style="width:20%">
                                    <label for="desktop-name" style="width:100px; font-size: 14px; font-style: italic">Name</label><br>
                                    <input id="desktop-name" v-model="desktopItem.name"
                                           style="border:1px gainsboro solid;">
                                </div>
                                <div style="width:40%; text-align: left">
                                    <a class="pan-btn green-btn" style="width: 50%; text-align:center; border-radius: 0px; padding:10px;"
                                       @click="saveDesktop()"> Сохранить рабочий стол </a>
                                </div>
                            </div><hr>

                            <!-- Виджеты рабочего стола -->
                            <div
                                class="drop-container"
                                style="height:464px; border:2px grey dotted"
                                @dragover="dragOverRun($event)"
                                @drop="dropStop($event)"
                                @dragleave="dragLeave($event)" >
                                <template v-for="(item, index) in desktopWidgetList">
                                    <div draggable="true"
                                         :class="'vidget-item-box item__' + item.name"
                                         :style="'margin-left:' + item.pos.left + 'px; ' + 'margin-top:' + item.pos.top +'px;'"
                                         @dragstart="dragStartEdit($event, index, item)"
                                         @dragend="dragEndEdit($event)" >
                                         {{item.description}}
                                         <div><i @click="deleteWidget(index, item)"
                                                class="el-icon-delete" style="color:red; "/></div>
                                    </div>
                                </template>
                            </div>

                            <div class="text-center el-col el-col-40"
                                 style="width: 100%; margin:10px 0px 10px 0px;"></div>

                        </el-card>
                    </el-col>
                </template>

            </el-row>

            <div>
                <!--<pre>{{elementPos}}</pre>-->
                <!--<pre>{{desktopWidgetList}}</pre>-->
                <!--<pre>{{widgetSettings}}</pre>-->
                <!--<pre>{{widgetSchema.properties}}</pre>-->
            </div>

        </div>
    </div>
</template>

<script>

    import DragService from '@/utils/drag-service';
    import HttpService from '@/utils/http-request';

    export default {
        name: 'ConstructVidget',
        // components: {},
        mixins: [DragService],
        data() {

            const hostName = 'http://bolderfest.ru';
            const apiUrl = hostName + '/iac-dashboard/api/public/iac/dashboard';

            return {

                apiUrl : apiUrl,   // api-url
                openDesktopState : false, // состояние рабочего стола
                selectElemName   : '', // выбранное имя виджета

                widgetSchema     : {}, // общая схема виджетов
                widgetSettings   : {}, // настройки виджетов
                desktopList      : [], // список рабочих столов
                desktopWidgetList: [], // виджеты рабочего стола

                // текущий рабочий стол
                desktopItem : {
                    desktop_id  : 0,
                    name        : '',
                    label       : '',
                    description : '',
                    default_count_widget : 3, // количество отображаемых виджетов на столе
                    widget_list : [],
                },

            }
        }, // --- end data

        created() {
            this.getSchema();
            this.getWidgetSettrings();
            this.addNewDesktop();
            // this.getDesktopList();
        },

        methods: {

            cloneItem(object) {
                let newObject = Object.assign({}, object);
                return newObject;
            },

            // получаем схему виджетов
            getSchema() {
                const url = this.apiUrl + '/get-schema';
                HttpService({ url: url, method: 'get'}).then(response => {
                    this.widgetSchema = JSON.parse(response);
                    // lg(typeof this.widgetSchema);
                })
            },

            // получаем настройки виджетов
            getWidgetSettrings() {
                const url = this.apiUrl + '/get-widget-settings';
                HttpService({ url: url, method: 'get'}).then(response => {
                    this.widgetSettings = JSON.parse(response);
                    //lg(typeof this.widgetSettings);
                })
            },

            // создаем новый рабочий стол
            addNewDesktop() {
                this._clear();
                this.desktopWidgetList = [];
                this.openDesktopState = true;
            },

            // создаем новый виджет
            addNewWidget(param) {
                let widget = {};
                const widgetName = this.selectElemName
                let widgetProps  = this.cloneItem(this.widgetSchema['properties'][widgetName]);
                let settings     = this.cloneItem(this.widgetSettings['general_settings']);
                let wSetting     = this.cloneItem(this.widgetSettings[widgetName]);

                widget['widget_id']  = 0;
                widget['desktop_id'] = 0;
                widget['name']       = widgetName
                widget['pos']        = param.pos
                widget['settings']   = Object.assign(settings, wSetting);
                widget['properties'] = widgetProps

                const item = this.cloneItem(Object.assign({}, widget));

                this.desktopWidgetList.push(item)
            },

            editWidget(param) {
                this.desktopWidgetList[this.elemIndex]['pos'] = param.pos;
            },

            deleteVidget(index, vidget) {
                delete this.desktopWidgetList[index];
                let items = this.cloneItem(this.desktopWidgetList);
                this.desktopWidgetList = [];
                for (let i in items) {
                    this.desktopWidgetList.push(items[i]);
                }
            },

            _clear() {
                 // this.desktopId    = 0;
                 //this.desktopName  = '';
                 //this.desktopTitle = '';
            },

            saveDesktop(callback = null) {

                const url = this.apiUrl + '/post/desktop-save';
                this.desktopItem['widget_list'] = this.cloneItem(this.desktopWidgetList);
                const postData = this.desktopItem;

                this.postRequest(url, postData)
                    .then( response => console.log(response))      // обрабатываем результат вызова response.json()
                    .catch(error    => console.error(error))
            },

            postRequest(url, data, headers = {}) {
                headers['Content-Type'] = 'application/json';
                return fetch(url, {
                    headers    : new Headers(headers),
                    credentials: 'same-origin',        // параметр определяющий передвать ли разные сессионные данные вместе с запросом
                    method     : 'POST',               // метод POST
                    body       : JSON.stringify(data), //
                }).then(response => response.json())   // возвращаем промис
            }

            // addNewDesktop() {
            //     this.desktopLabel = 'создание';
            //     this.clearDate();
            //     this.desktopVidgetList = [];
            //     this.openNewDesktop = true;
            // },
            //
            // editDesktop() {
            //     this.desktopLabel = 'редактирование';
            //     this.clearDate();
            //     this.desktopVidgetList = []
            //     this.openEditDesktop = true
            // },
            //

            //
            // deleteVidget(index, vidget) {
            //
            //     delete this.desktopVidgetList[index];
            //     let items = Object.assign({}, this.desktopVidgetList);
            //     this.desktopVidgetList = [];
            //     for (let i in items) {
            //         this.desktopVidgetList.push(items[i]);
            //     }
            // },
            //
            // getDesktopList() {
            //     const url = this.apiUrl + '/desktop-list';
            //     HttpService({
            //         url: url,
            //         method: 'get'
            //     }).then(response => {
            //         this.desktopList = response;
            //     })
            // },
            //
            // async getDesktopItem(itemId) {
            //     this.editDesktop();
            //     const url = this.apiUrl + '/desktop/' + itemId;
            //     const resp = await HttpService({url: url, method: 'get'})
            //     this.desktopTitle = resp['title'];
            //     this.desktopId = resp['id'];
            //     this.desktopVidgetList = [];
            //     for (let i in resp['vidgets']) {
            //         let item = JSON.parse(resp['vidgets'][i]);
            //         this.desktopVidgetList.push(item)
            //     }
            //
            // },
            //


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

    .item__table {
        width: 120px;
        height: 50px;
    }

    .item__chart {
        height: 70px;
    }

    .item__notifications {

    }

    .item__calendar {

    }

</style>
