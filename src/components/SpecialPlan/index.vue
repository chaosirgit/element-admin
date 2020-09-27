<template>
  <el-row>
    <el-input v-model="specialCount" placeholder="请输入额外活动赠送数量" class="input-with-select">
      <el-select slot="prepend" v-model="planId" placeholder="请选择" style="width: 150px;">
        <el-option v-for="plan in plans" :key="plan.id" :label="plan.name" :value="plan.id" />
      </el-select>
    </el-input>
  </el-row>
</template>
<script>

export default {
  name: 'SpecialPlan',
  props: {
    specialCount: {
      type: Number,
      default: 0
    },
    planId: {
      type: Number,
      default: 0
    },
    plans: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      search: '',
      status: null,
      startTime: '',
      endTime: ''
    }
  },
  computed: {
  },
  methods: {
    handleFilter() {
      this.$emit('specialPlan', { planId: this.planId, specialCount: this.specialCount })
    },
    handleCreate() {
      this.$emit('create')
    },
    handleDownload() {
      this.$emit('export')
    }
  }
}
</script>
<style>

</style>
