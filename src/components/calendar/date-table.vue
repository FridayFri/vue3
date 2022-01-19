<template>
  <table class="table-date" cellspacing="0" cellpadding="0">
    <thead>
      <th v-for="day in WEEK_DAYS" :key="day">{{ day }}</th>
    </thead>
    <tbody>
      <tr v-for="(row, index) in rows" :key="index">
        <td
          v-for="(cell, index) in row"
          :key="index"
          :class="getCellClass(cell)"
          @click="handlePickDay(cell)"
        >
          <div class="calendar-day">
            <span>{{ cell.text }}</span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <span>{{ date }}</span>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import dayjs from 'dayjs'

import type { Dayjs } from 'dayjs'

type CellType = 'next' | 'prev' | 'current'
interface Cell {
  text: number
  type: CellType
}
const dateTableProps = {
  selectedDay: {
    type: Object
  },
  date: {
    type: Object,
    required: true
  }
} as const
const dateTableEmits = {
  pick: (value: Dayjs) => Object
}
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
const rangeArr = (n: number) => Array.from(Array(n).keys())

const getPrevMonthLastDays = (date: Dayjs, count: number) => {
  const lastDay = date.subtract(1, 'month').endOf('month').date()
  return rangeArr(count).map((_, index) => lastDay - (count - index - 1))
}
const getMonthDays = (date: Dayjs) => {
  const days = date.daysInMonth()
  return rangeArr(days).map((_, index) => index + 1)
}
const toNestedArr = (days: Cell[]) =>
  rangeArr(days.length / 7).map((index) => {
    const start = index * 7
    return days.slice(start, start + 7)
  })

export default defineComponent({
  props: dateTableProps,
  emits: dateTableEmits,
  setup(props, { emit }) {
    const now = dayjs()
    const firstDayOfWeek: number = (now as any).$locale().weekStart || 0

    const rows = computed(() => {
      let days: Cell[] = []
      const firstDay = props.date.startOf('month').day() || 7
      const prevMonthDays: Cell[] = getPrevMonthLastDays(props.date, firstDay - firstDayOfWeek).map(
        (day) => ({
          text: day,
          type: 'prev'
        })
      )
      const currentMonthDays: Cell[] = getMonthDays(props.date).map((day) => ({
        text: day,
        type: 'current'
      }))
      days = [...prevMonthDays, ...currentMonthDays]
      const nextMonthDays: Cell[] = rangeArr(42 - days.length).map((_, index) => ({
        text: index + 1,
        type: 'next'
      }))
      days = days.concat(nextMonthDays)
      return toNestedArr(days)
    })

    const getFormattedDate = (day: number, type: CellType): Dayjs => {
      switch (type) {
        case 'prev':
          return props.date.startOf('month').subtract(1, 'month').date(day)
        case 'next':
          return props.date.startOf('month').add(1, 'month').date(day)
        case 'current':
          return props.date.date(day)
      }
    }
    const getCellClass = ({ text, type }: Cell) => {
      const classes: string[] = [type]
      if (type === 'current') {
        const date = getFormattedDate(text, type)
        if (date.isSame(props.selectedDay, 'day')) {
          classes.push('is-selected')
        }
        if (date.isSame(now, 'day')) {
          classes.push('is-today')
        }
      }
      return classes
    }

    const handlePickDay = ({ text, type }: Cell) => {
      const date = getFormattedDate(text, type)
      emit('pick', date)
    }

    return {
      WEEK_DAYS,
      rows,
      getCellClass,
      handlePickDay
    }
  }
})
</script>
<style lang="less">
.table-date {
  table-layout: fixed;
  width: 100%;
  thead {
    th {
      padding: 12px 0;
      color: '#606266';
      font-weight: normal;
    }
  }

  .is-selected {
    background-color: #f2f8fe;
    transition: all 0.3s;
  }
  .is-today {
    color: #409eff;
  }
  .calendar-day {
    box-sizing: border-box;
    padding: 8px;
    height: 85px;
    &:hover {
      cursor: pointer;
      background-color: #f2f8fe;
      transition: all 0.3s ease;
    }
  }
  .prev {
    color: #c0c4cc;
  }
  .next {
    color: #c0c4cc;
  }
}
</style>
