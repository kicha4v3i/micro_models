<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Data
const stretch = ref('')
const pipeWeight = ref('')
const overpull = ref('')
const drillPipe = ref(true)
const casing = ref(false)

// Units
const stretchUnit = ref('inch')
const pipeWeightUnit = ref('ppf')
const overpullUnit = ref('lbs')
const freePipeUnit = ref('ft')

// Select Pipe
const selectDrillpipe = () => {
    drillPipe.value = true
    casing.value = false
}

const selectCasing = () => {
    drillPipe.value = false
    casing.value = true
}

// Conversions
const stretchConv = computed(() => {
    if (stretchUnit.value == 'inch') {
        stretch.value = (stretch.value / 1000 * 3.281 * 12).toFixed(2)
    } else {
        stretch.value = (stretch.value * 1000 / 3.281 / 12).toFixed(0)
    }
})

const pipeWeightConv = computed(() => {
    if (pipeWeightUnit.value == 'ppf') {
        pipeWeight.value = (pipeWeight.value * 2.204 / 3.281).toFixed(2)
    } else {
        pipeWeight.value = (pipeWeight.value / 2.204 * 3.281).toFixed(2)
    }
})

const overpullConv = computed(() => {
    if (overpullUnit.value == 'lbs') {
        overpull.value = (overpull.value * 2.204).toFixed(0)
    } else {
        overpull.value = (overpull.value / 2.204).toFixed(0)
    }
})

// Base Units
const stretchBaseUnit = computed(() => {
    if (stretchUnit.value == 'mm') {
        return stretch.value / 1000 * 3.281 * 12
    } else {
        return stretch.value
    }
})

const pipeWeightBaseUnit = computed(() => {
    if (pipeWeightUnit.value == 'kg/m') {
        return pipeWeight.value * 2.204 / 3.281
    } else {
        return pipeWeight.value
    }
})

const overpullBaseUnit = computed(() => {
    if (overpullUnit.value == 'kg') {
        return overpull.value * 2.204
    } else {
        return overpull.value
    }
})

// Calculations
const freePipeLength = computed(() => {
    // Free Pipe Constant, K
    let K
    if (drillPipe.value) {
        K = 1.5 / pipeWeightBaseUnit.value
    } else {
        K = 1.4 / pipeWeightBaseUnit.value
    }
    
    if (freePipeUnit.value == 'ft') {
        return (1000000 * stretchBaseUnit.value / (K * overpullBaseUnit.value)).toFixed(0)
    } else {
        return ((1000000 * stretchBaseUnit.value / (K * overpullBaseUnit.value)) / 3.281).toFixed(0)
    }
    

})
</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <!-- Casing / Tubing or Drillpipe -->
                <div class="select-type d-flex">
                    <div class="form-check me-5">
                        <input @click="selectDrillpipe" class="form-check-input" type="radio" name="pipeType" id="drillpipe" checked>
                        <label for="drillpipe" class="form-check-label">Drillpipe</label>
                    </div>
                    <div class="form-check">
                        <input @click="selectCasing" class="form-check-input" type="radio" name="pipeType" id="casing-tubing">
                        <label for="casing-tubing" class="form-check-label">Casing / Tubing</label>
                    </div>
                </div>
                

                <!-- Stretch -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="stretch" step="1" placeholder="Pipe Stretch" v-model="stretch">
                        <label for="stretch" class="form-label">Pipe Stretch</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="stretchConv" v-model="stretchUnit" class="form-select border-info">
                            <option>inch</option>
                            <option>mm</option>
                        </select>
                    </div>
                </div>

                 <!-- Pipe Weight -->
                 <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="pipeWeight" step="1" placeholder="Pipe Weight" v-model="pipeWeight">
                        <label for="pipeWeight" class="form-label">Pipe Weight</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="pipeWeightConv" v-model="pipeWeightUnit" class="form-select border-info">
                            <option>ppf</option>
                            <option>kg/m</option>
                        </select>
                    </div>
                </div>

                <!-- Overpull -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="overpull" step="1" placeholder="Overpull" v-model="overpull">
                        <label for="overpull" class="form-label">Overpull</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="overpullConv" v-model="overpullUnit" class="form-select border-info">
                            <option>lbs</option>
                            <option>kg</option>
                        </select>
                    </div>
                </div>
            
            </div>
            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Length of Free Pipe</span>
                        <h3 class="text-center text-success">{{ freePipeLength }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="freePipeUnit">
                                <option>ft</option>
                                <option>m</option>
                            </select>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>