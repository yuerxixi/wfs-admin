<template>
  <div :id="id" style="width: 100%;height: 100%" />
</template>

<script>
export default {
  name: 'Dglx',
  count: {
    type: String,
    default() {
      return '1'
    }
  },
  data() {
    return {
      dataType: [
        { value: 37, name: '10米杆' },
        { value: 21, name: '15米杆' },
        { value: 21, name: '30米杆' }
      ]
    }
  },
  computed: {
    id() {
      return `dglx-chart${this.count}`
    }
  },
  mounted() {
    this.iCharts()
  },
  methods: {
    iCharts() {
      const total = 60
      const iChart = this.$echarts.init(document.getElementById(this.id))
      const dataType = this.dataType
      const option = {
        color: ['#C8AC29', '#49B481', '#536DC3'],
        tooltip: {
          trigger: 'item'
        },
        title: {
          zlevel: 0,
          text: [
            '{value|' + total + '}',
            '{name|灯杆总数}'
          ].join('\n'),
          rich: {
            value: {
              color: '#ffffff',
              fontSize: 30,
              fontWeight: 'bold',
              lineHeight: 40
            },
            name: {
              color: '#909399',
              lineHeight: 20
            }
          },
          top: 'center',
          left: '90',
          textAlign: 'center',
          textStyle: {
            rich: {
              value: {
                color: '#ffffff',
                fontSize: 28,
                fontWeight: 'bold',
                lineHeight: 40
              },
              name: {
                color: '#909399',
                lineHeight: 20
              }
            }
          }
        },
        legend: {
          right: '8%',
          top: '25%',
          orient: 'vertical',
          textStyle: {
            rich: {
              title: {
                fontSize: 14,
                width: 70,
                color: 'rgba(255, 255, 255, 0.6)'
              },
              bili: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 14
              }
            }
          },
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 12,
          toolbox: {
            show: false,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          formatter: function(name) {
            // let total = 0
            let value = 0
            dataType.forEach(item => {
              // total += item.value
              if (name === item.name) {
                value = item.value
              }
            })
            return ` {title|${name}}    {bili|${value}%}`
          }
        },
        series: [
          {
            // name: '灯杆总数',
            type: 'pie',
            z: 2,
            radius: ['60%', '80%'],
            center: ['25%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#141D30',
              borderWidth: 3
            },
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            data: this.dataType
          },
          {
            // name: '灯杆总数',
            type: 'pie',
            z: 2,
            radius: ['60%', '80%'],
            center: ['25%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#141D30',
              borderWidth: 3,
              color: function(params) {
                const colorList = [
                  'rgba(200, 172, 41, 0.3)', 'rgba(73, 180, 129, 0.3)', 'rgba(83, 109, 195, 0.3)'
                ]
                return colorList[params.dataIndex]
              }
            },
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            data: this.dataType
          }
        ]
      }
      iChart.setOption(option)
      window.onresize = function() {
        iChart.resize()
      }
    }
  }
}
</script>

<style scoped>

</style>
