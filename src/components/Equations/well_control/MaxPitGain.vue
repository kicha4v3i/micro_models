<script setup>
import { ref, computed } from 'vue';
import store from '@/store'

// Data
const formPress = ref('')
const pitVol = ref('')
const kmw = ref('')

// Units
const formPressUnit = ref('psi')
const pitVolUnit = ref('bbls')
const kmwUnit = ref('ppg')
const pitGainUnit = ref('bbls')

// Conversions
const formPressConv = computed(() => {
    if (formPressUnit.value == 'psi') {
        formPress.value = (formPress.value * 0.145).toFixed(0)
    } else {
        formPress.value = (formPress.value / 0.145).toFixed(0)
    }
})

let prevPitVol = 'bbls'
const pitVolConv = computed(() => {
    if (prevPitVol == 'bbls') {
        if (pitVolUnit.value == 'gal') {
            pitVol.value = (pitVol.value * 42).toFixed(1)
            prevPitVol = 'gal'
        } else if (pitVolUnit.value == 'cu.m') {
            pitVol.value = (pitVol.value * 0.1589).toFixed(3)
            prevPitVol = 'cu.m'
        } else {
            pitVol.value = (pitVol.value * 5.615).toFixed(3)
            prevPitVol = 'cu.ft'
        }
    } else if (prevPitVol == 'gal') {
        if (pitVolUnit.value == 'bbls') {
            pitVol.value = (pitVol.value / 42).toFixed(1)
            prevPitVol = 'bbls'
        } else if (pitVolUnit.value == 'cu.m') {
            pitVol.value = (pitVol.value * 0.00378).toFixed(3)
            prevPitVol = 'cu.m'
        } else {
            pitVol.value = (pitVol.value * 0.13368).toFixed(3)
            prevPitVol = 'cu.ft'
        }
    } else if (prevPitVol == 'cu.m') {
        if (pitVolUnit.value == 'bbls') {
            pitVol.value = (pitVol.value / 0.1589).toFixed(1)
            prevPitVol = 'bbls'
        } else if (pitVolUnit.value == 'gal') {
            pitVol.value = (pitVol.value / 0.00378).toFixed(1)
            prevPitVol = 'gal'
        } else {
            pitVol.value = (pitVol.value * 35.3147).toFixed(3)
            prevPitVol = 'cu.ft'
        }
    } else {
        if (pitVolUnit.value == 'bbls') {
            pitVol.value = (pitVol.value /5.615).toFixed(1)
            prevPitVol = 'bbls'
        } else if (pitVolUnit.value == 'gal') {
            pitVol.value = (pitVol.value / 0.13368).toFixed(1)
            prevPitVol = 'gal'
        } else {
            pitVol.value = (pitVol.value / 35.3147).toFixed(3)
            prevPitVol = 'cu.m'
        }
    }
})

const kmwConv = computed(() => {
    if (kmwUnit.value == 'ppg') {
        kmw.value = (kmw.value * 8.33).toFixed(2)
    } else {
        kmw.value = (kmw.value / 8.33).toFixed(2)
    }
})

// Calculations
const maxPitGain = computed(() => {
    //Base Units
    let formPressBaseUnit
    let pitGainBaseUnit
    let kmwBaseUnit
    let dbBaseUnit
    let odBaseUnit

    if (formPressUnit.value == 'kPa') {
        formPressBaseUnit = formPress.value * 0.145
    } else {
        formPressBaseUnit = formPress.value
    }

    if (pitVolUnit.value == 'gal') {
        pitGainBaseUnit = pitVol.value / 42
    } else if (pitVolUnit.value == 'cu.m') {
        pitGainBaseUnit = pitVol.value / 0.1589
    } else if (pitVolUnit.value == 'cu.ft') {
        pitGainBaseUnit = pitVol.value / 5.615
    } else {
        pitGainBaseUnit = pitVol.value
    }

    if (kmwUnit.value == 'g/cc') {
        kmwBaseUnit = kmw.value * 8.33
    } else {
        kmwBaseUnit = kmw.value
    }

    if (store.inputUnits.bitSizeUnit == 'mm') {
        dbBaseUnit = store.mainInputs.bitSize / 1000 * 3.281 * 12
    } else {
        dbBaseUnit = store.mainInputs.bitSize
    }

    if (store.inputUnits.pipeOD == 'mm') {
        odBaseUnit = store.mainInputs.pipeOD / 1000 * 3.281 * 12
    } else {
        odBaseUnit = store.mainInputs.pipeOD
    }

    let annCap = (dbBaseUnit**2 - odBaseUnit**2) / 1029.4

    // Calculations
    if (formPress.value == '' || pitVol.value == '' || kmw.value == '') {
        return 0
    }

    if (pitGainUnit.value == 'bbls') {
        return (4 * Math.sqrt(formPressBaseUnit * pitGainBaseUnit * annCap / kmwBaseUnit)).toFixed(1)
    } else if (pitGainUnit.value == 'gal') {
        return (4 * Math.sqrt(formPressBaseUnit * pitGainBaseUnit * annCap / kmwBaseUnit) * 42).toFixed(1)
    } else if (pitGainUnit.value == 'cu.m') {
        return (4 * Math.sqrt(formPressBaseUnit * pitGainBaseUnit * annCap / kmwBaseUnit) * 0.1589).toFixed(3)
    } else {
        return (4 * Math.sqrt(formPressBaseUnit * pitGainBaseUnit * annCap / kmwBaseUnit) * 5.615).toFixed(3)
    }
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <h3 class="fs-5 ms-5">Max Pit Gain from Gas Kick with WBM</h3>

                <!-- Formation Pressure -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="formPress" step="1" placeholder="Formation Pressure" v-model="formPress">
                        <label for="formPress" class="form-label">Formation Pressure</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="formPressConv" v-model="formPressUnit" class="form-select border-info">
                            <option>psi</option>
                            <option>kPa</option>
                        </select>
                    </div>
                </div>

                <!-- Pit Volume Gain -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="pitVol" step="1" placeholder="Pit Volume" v-model="pitVol">
                        <label for="pitVol" class="form-label">Pit Gain</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="pitVolConv" v-model="pitVolUnit" class="form-select border-info">
                            <option>bbls</option>
                            <option>gal</option>
                            <option>cu.m</option>
                            <option>cu.ft</option>
                        </select>
                    </div>
                </div>

                <!-- Kill Mud Weight -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="kmw" step="0.1" placeholder="Kill Mud Weight" v-model="kmw">
                        <label for="kmw" class="form-label">Kill Mud Weight</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="kmwConv" v-model="kmwUnit" class="form-select border-info">
                            <option>ppg</option>
                            <option>g/cc</option>
                        </select>
                    </div>
                </div>

            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Max Pit Gain</span>
                        <h3 class="text-center text-success">{{ maxPitGain }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="pitGainUnit">
                                <option>bbls</option>
                                <option>gal</option>
                                <option>cu.m</option>
                                <option>cu.ft</option>
                            </select>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>