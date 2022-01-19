<template>
  <div class="calendar">
    <div class="calendar-header">
      <div class="calendar-header-title">{{ new Date().getFullYear() }}</div>
      <div class="calendar-header-title" @click="handlePrevMonth">上个月</div>
      <div class="calendar-header-title" @click="handleNextMonth">下个月</div>
    </div>
    <div class="calendar-body">
      <date-table :date="date" :selected-day="realSelectedDay" @pick="pickDay"></date-table>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import dayjs from 'dayjs'
import DateTable from './date-table.vue'
import type { ComputedRef } from 'vue'
import type { Dayjs } from 'dayjs'

const calendarProps = {
  modelValue: {
    type: Date
  }
} as const
export default defineComponent({
  name: 'Calendar',
  components: { DateTable },
  props: calendarProps,
  setup(props, { emit }) {
    const now = dayjs()
    const selectedDay = ref<Dayjs>()
    const date: ComputedRef<Dayjs> = computed(() => {
      if (!props.modelValue) {
        console.log('111')
        if (realSelectedDay.value) {
          return realSelectedDay.value
        }
        return now
      }
      console.log('222')
      return dayjs(props.modelValue)
    })
    const realSelectedDay = computed<Dayjs | undefined>({
      get() {
        if (!props.modelValue) return selectedDay.value
        return date.value
      },
      set(val) {
        if (!val) return
        selectedDay.value = val
        const result = val.toDate()
        emit('input', result)
        emit('update:modelValue', result)
      }
    })
    const pickDay = (day: Dayjs) => {
      realSelectedDay.value = day
    }
    const handlePrevMonth = () => {
      pickDay(date.value.subtract(1, 'month').date(1))
    }
    const handleNextMonth = () => {
      pickDay(date.value.add(1, 'month').date(1))
    }
    return {
      date,
      realSelectedDay,
      pickDay,
      handlePrevMonth,
      handleNextMonth
    }
  }
})
</script>
<style lang="less">
.calendar {
  &-header {
    display: flex;
    justify-content: space-around;
  }
}
</style>
