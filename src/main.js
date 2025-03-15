import { createApp } from 'vue'

import '@/assets/main.css'
import App from './App.vue'
import router from './router'

import '@/styles/common.less'
import pinia from './stores'


// 表单校验
import { Form, Field, CellGroup } from 'vant'
// 弹窗
import { Dialog } from 'vant';
// 加载
import { Loading } from 'vant';
// 下拉刷新
import { PullRefresh } from 'vant';
// 浮动气泡
import { FloatingBubble } from 'vant';
// 导航栏
import { NavBar } from 'vant';
// 搜索框
import { Search } from 'vant';
// 宫格
import { TreeSelect } from 'vant';
import { Icon } from 'vant';
import { GridItem } from 'vant';
import { ImagePreview } from 'vant';
import { Rate } from 'vant';
import { ActionSheet } from 'vant';
import { Barrage } from 'vant';
import { Area } from 'vant';
import { AddressEdit } from 'vant';
import {
  Skeleton,
  SkeletonTitle,
  SkeletonImage,
  SkeletonAvatar,
  SkeletonParagraph,
} from 'vant';
import { AddressList } from 'vant';

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
app.use(ImagePreview);
app.use(Form);
app.use(Field);
app.use(CellGroup);
app.use(Dialog);
app.use(Loading);
app.use(PullRefresh);
app.use(FloatingBubble)
app.use(Search);
app.use(NavBar);
app.use(GridItem);
app.use(Rate);
app.use(ActionSheet);
app.use(Barrage);
app.use(Icon);
app.use(TreeSelect);
app.use(Skeleton);
app.use(SkeletonTitle);
app.use(SkeletonImage);
app.use(SkeletonAvatar);
app.use(SkeletonParagraph);
app.use(AddressList)
app.use(AddressEdit);
app.use(Area);