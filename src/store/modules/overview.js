const overview = {
  state: {
    deviceModelState: false,
    deviceAlarmModelState: false,
    parkItem: {},
    alarmParkItem: {}
  },

  mutations: {},

  actions: {
    SetDeviceModelState({ commit, state }, data) {
      state.deviceModelState = data.deviceModelState
      state.parkItem = data.parkItem
    },
    hideDeviceModel({ commit, state }, data) {
      state.deviceModelState = data
    },
    hideDeviceAlarmModel({ commit, state }, data) {
      state.deviceAlarmModelState = data
    }
  }
}

export default overview
