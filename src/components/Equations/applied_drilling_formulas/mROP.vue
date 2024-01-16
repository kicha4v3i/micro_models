<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Data
const fg = ref('')
const apl = ref('')
const tvd = ref('')

// Units
const fgUnit = ref('ppg')
const aplUnit = ref('psi')
const tvdUnit = ref('ft')
const maxROPUnit = ref('ft/hr')

// Conversions
/* Base Units */
const fgBaseUnit = computed(() => {
    if (fgUnit.value == 'g/cc') {
        return fg.value * 8.33
    } else if (fgUnit.value == 'psi/ft') {
        return fg.value / 0.052
    } else {
        return fg.value
    }
})

const aplBaseUnit = computed(() => {
    if (aplUnit.value == 'kPa') {
        return apl.value * 0.145 / (0.052 * tvdBaseUnit.value)
    } else {
        return apl.value / (0.052 * tvdBaseUnit.value)
    }
})

const tvdBaseUnit = computed(() => {
    if (tvdUnit.value == 'm') {
        return tvd.value * 3.281
    } else {
        return tvd.value
    }
})

const dbBaseUnit = computed(() => {
    if (store.inputUnits.bitSizeUnit == 'mm') {
        return store.mainInputs.bitSize / 1000 * 3.281 * 12
    } else {
        return store.mainInputs.bitSize
    }
})

const flowrateBase = computed(() => {
    if (store.inputUnits.flowrateUnit == 'lpm') {
        return store.mainInputs.flowrate * 0.2642
    } else {
        return store.mainInputs.flowrate
    }
})

const mwBase = computed(() => {
    if (store.inputUnits.mwUnit == 'g/cc') {
        return store.mainInputs.mw * 8.33
    } else {
        return store.mainInputs.mw
    }
})

/* Input Conversions */
let fgPrevUnit = 'ppg'
const fgConv = computed(() => {
    if (fgPrevUnit == 'ppg') {
        if (fgUnit.value == 'g/cc') {
            fg.value = (fg.value / 8.33).toFixed(2)
            fgPrevUnit = 'g/cc'
        } else {
            fg.value = (fg.value * 0.052).toFixed(3)
            fgPrevUnit = 'psi/ft'
        }
    } else if (fgPrevUnit == 'g/cc') {
        if (fgUnit.value == 'ppg') {
            fg.value = (fg.value * 8.33).toFixed(2)
            fgPrevUnit = 'ppg'
        } else {
            fg.value = (fg.value * 8.33 * 0.052).toFixed(3)
            fgPrevUnit = 'psi/ft'
        }
    } else {
        if (fgUnit.value == 'ppg') {
            fg.value = (fg.value / 0.052).toFixed(2)
            fgPrevUnit = 'ppg'
        } else {
            fg.value = (fg.value / 0.052 / 8.33).toFixed(2)
            fgPrevUnit = 'g/cc'
        }
    }
    
})

const aplConv = computed(() => {
    if (aplUnit.value == 'psi') {
        apl.value = (apl.value * 0.145).toFixed(0)
    } else {
        apl.value = (apl.value / 0.145).toFixed(0)
    }
})

const tvdConv = computed(() => {
    if (tvdUnit.value == 'ft') {
        tvd.value = (tvd.value * 3.281).toFixed(0)
    } else {
        tvd.value = (tvd.value / 3.281).toFixed(0)
    }
})

// Calculations
const maxROP = computed(() => {
    if (maxROPUnit.value == 'ft/hr') {
        return ((flowrateBase.value * (fgBaseUnit.value - aplBaseUnit.value - mwBase.value)) / (dbBaseUnit.value**2 * (141.4296 * 10**-4 - (6.7995 * 10**-4 * (fgBaseUnit.value - aplBaseUnit.value))))).toFixed(2)
    } else {
        return ((flowrateBase.value * (fgBaseUnit.value - aplBaseUnit.value - mwBase.value)) / (dbBaseUnit.value**2 * (141.4296 * 10**-4 - (6.7995 * 10**-4 * (fgBaseUnit.value - aplBaseUnit.value)))) / 3.281).toFixed(2)
    }
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">

                <!-- Fracture Gradient -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="fg" step="0.1" placeholder="Fracture Gradient" v-model="fg">
                        <label for="fg" class="form-label">Fracture Gradient</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="fgConv" v-model="fgUnit" class="form-select border-info">
                            <option>ppg</option>
                            <option>g/cc</option>
                            <option>psi/ft</option>
                        </select>
                    </div>
                </div>

                <!-- Annular Pressure Loss -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="apl" step="0.1" placeholder="Annular Pressure Loss" v-model="apl">
                        <label for="apl" class="form-label">Annular Pressure Loss</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="aplConv" v-model="aplUnit" class="form-select border-info">
                            <option>psi</option>
                            <option>kPa</option>
                        </select>
                    </div>
                </div>

                <!-- Well TVD -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="tvd" step="1" placeholder="Well TVD" v-model="tvd">
                        <label for="tvd" class="form-label">Well TVD</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="tvdConv" v-model="tvdUnit" class="form-select border-info">
                            <option>ft</option>
                            <option>m</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="outputs ms-5 d-flex flex-column align-items-center">
                <!-- Max ROP -->
                <div class="lp-height d-flex align-items-end ms-5 mb-5">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Max ROP</span>
                        <h3 class="text-center text-success">{{ maxROP }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="maxROPUnit">
                                <option>ft/hr</option>
                                <option>m/hr</option>
                            </select>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>