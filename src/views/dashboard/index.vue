<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { getName } from '@/utils/auth'

export default {
  name: 'Dashboard',
  data() {
    return {
      name: this.$store.state.admin.name
    }
  },
  mounted: function() {
    console.log(this.name)
    if (!this.name) {
      this.$store.dispatch('admin/getInfo')
        .then(() => {
          // console.log(this.$store.state)
          this.name = getName()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
