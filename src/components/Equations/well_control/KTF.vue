<script setup>
import { ref, computed } from 'vue';
import store from '@/store'

// Data
const wellTVD = ref('')
const casingTVD = ref('')
const maxMW = ref('')

// Units
const wellTVDUnit = ref('ft')
const casingTVDUnit = ref('ft')
const maxMWUnit = ref('ppg')
const ktfUnit = ref('ppg')

// Error Handling
const depthError = ref(false)

const tvdCheck = computed(() => {
    if (wellTVD.value == '' || wellTVD.value == null) {
        return
    }

    let wellTvdBaseUnit
    let casingTvdBaseUnit

    if (wellTVDUnit.value == 'm') {
        wellTvdBaseUnit = wellTVD.value * 3.281
    } else {
        wellTvdBaseUnit = wellTVD.value
    }

    if (casingTVDUnit.value == 'm') {
        casingTvdBaseUnit = casingTVD.value * 3.281
    } else {
        casingTvdBaseUnit = casingTVD.value
    }

    if (casingTvdBaseUnit > wellTvdBaseUnit) {
        depthError.value = true
        setTimeout(() => {
            depthError.value = false
        }, 3000);
    }
})

// Conversions
const wellTVDConv = computed(() => {
    if (wellTVDUnit.value == 'ft') {
        wellTVD.value = (wellTVD.value * 3.281).toFixed(0)
    } else {
        wellTVD.value = (wellTVD.value / 3.281).toFixed(0)
    }
})

const casingTVDConv = computed(() => {
    if (casingTVDUnit.value == 'ft') {
        casingTVD.value = (casingTVD.value * 3.281).toFixed(0)
    } else {
        casingTVD.value = (casingTVD.value / 3.281).toFixed(0)
    }
})

const mwConv = computed(() => {
    if (maxMWUnit.value == 'ppg') {
        maxMW.value= (maxMW.value * 8.33).toFixed(2)
    } else {
        maxMW.value= (maxMW.value / 8.33).toFixed(2)
    }
})

// Calculations
const ktf = computed(() => {
    // Base Units
    let wellTvdBaseUnit
    let casingTvdBaseUnit
    let maxMWBaseUnit
    let mwBaseUnit

    if (wellTVDUnit.value == 'm') {
        wellTvdBaseUnit = wellTVD.value * 3.281
    } else {
        wellTvdBaseUnit = wellTVD.value
    }

    if (casingTVDUnit.value == 'm') {
        casingTvdBaseUnit = casingTVD.value * 3.281
    } else {
        casingTvdBaseUnit = casingTVD.value
    }

    if (maxMWUnit.value == 'g/cc') {
        maxMWBaseUnit = maxMW.value * 8.33
    } else {
        maxMWBaseUnit = maxMW.value
    }

    if (store.inputUnits.mwUnit == 'g/cc') {
        mwBaseUnit = store.mainInputs.mw * 8.33
    } else {
        mwBaseUnit = store.mainInputs.mw
    }

    // Calculations
    if (ktfUnit.value == 'ppg') {
        return (casingTvdBaseUnit / wellTvdBaseUnit * (maxMWBaseUnit - mwBaseUnit)).toFixed(2)
    } else {
        return ((casingTvdBaseUnit / wellTvdBaseUnit * (maxMWBaseUnit - mwBaseUnit)) / 8.33).toFixed(2)
    }
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <h3 class="fs-5 ms-5">Kick Tolerance Factor</h3>

                <!-- Well TVD -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input @focusout="tvdCheck" class="form-control" :class="{ 'is-invalid': depthError }" type="number" min="0" id="WellTVD" step="1" placeholder="Well TVD" v-model="wellTVD">
                        <label for="WellTVD" class="form-label">Well TVD</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="wellTVDConv" v-model="wellTVDUnit" class="form-select border-info">
                            <option>ft</option>
                            <option>m</option>
                        </select>
                    </div>
                </div>

                <!-- Casing TVD -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input @focusout="tvdCheck" class="form-control" :class="{ 'is-invalid': depthError }" type="number" min="0" id="CasingTVD" step="1" placeholder="Casing TVD" v-model="casingTVD">
                        <label for="CasingTVD" class="form-label">Casing TVD</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="casingTVDConv" v-model="casingTVDUnit" class="form-select border-info">
                            <option>ft</option>
                            <option>m</option>
                        </select>
                    </div>
                </div>

                <!-- TVD Check Error Message -->
                <span class="text-danger" v-if="depthError">Casing TVD should be lower than the Well TVD</span>

                <!-- Max Mud Weight -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="maxMW" step="1" placeholder="Max MW" v-model="maxMW">
                        <label for="maxMW" class="form-label">Max Mud Weight</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="mwConv" v-model="maxMWUnit" class="form-select border-info">
                            <option>ppg</option>
                            <option>g/cc</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Kick Tolerance Factor</span>
                        <h3 class="text-center text-success">{{ ktf }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="ktfUnit">
                                <option>ppg</option>
                                <option>g/cc</option>
                            </select>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>