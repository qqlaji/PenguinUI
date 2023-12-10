<!-- html -->
<template>
  <t-pagination
    :total="200"
    :current="1"
    :pageSize="10"
    :maxSize="8"
  ></t-pagination>
  <t-pagination
    :total="1000"
    :current="1"
    :pageSize="20"
    :maxSize="20"
  ></t-pagination>
</template>