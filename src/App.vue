<!--
 * @Author: 王云飞
 * @Date: 2023-02-01 11:02:45
 * @LastEditTime: 2023-02-02 11:08:29
 * @LastEditors: 王云飞
 * @Description: 
 * 
-->
<script setup lang="ts">
import '../dist/style.css'
import FileView from '../dist/file-view.js'
// import FileView from '../lib/main'
const fits = ['fill', 'contain', 'cover', 'none', 'scale-down']
const url =
  'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'

  const toPreview = () => {
    new FileView({
      files: [
        {
          url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          originName: 'aaa.img'
        },
        {
          url: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
          originName: 'bbb.img'
        }
      ],
      showUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
    })
  }
</script>
<template>
  <div class="demo-image">
    <div class="block">
      <el-image style="width: 100px; height: 100px" :src="url" fit="fill" @click="toPreview" />
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
