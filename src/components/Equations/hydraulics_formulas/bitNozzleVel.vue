<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Data
const TFA = ref('')

// Units
const tfaUnit = ref('sq.inch')
const bitNozzleVelUnit = ref('ft/sec')

// Conversions
const tfaConv = computed(() => {
    if (tfaUnit.value == 'sq.inch') {
        TFA.value = (TFA.value * 32 / 645.16).toFixed(2)
    } else {
        TFA.value = (TFA.value / 32 * 645.16).toFixed(0)
    }
})

// Calculations
const bitNozzleVel = computed(() => {
    let qBaseUnit
    let tfaBaseUnit
    if (store.flowrateUnit == 'lpm') {
        qBaseUnit = store.mainInputs.flowrateConv('gpm')
    } else {
        qBaseUnit = store.mainInputs.flowrate
    }

    if (tfaUnit.value == 'sq.mm') {
        tfaBaseUnit = (TFA.value * 32 / 645.16).toFixed(2)
    } else {
        tfaBaseUnit = TFA.value
    }

    if (bitNozzleVelUnit.value == 'ft/sec') {
        return (0.321 * qBaseUnit / tfaBaseUnit).toFixed(0)
    } else {
        return ((0.321 * qBaseUnit / tfaBaseUnit)/3.281).toFixed(0)
    }
    
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <h3 class="fs-5 ms-5">Bit Nozzle Velocity</h3>

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="tvdi" step="0.01" placeholder="TFA" v-model="TFA">
                        <label for="TFA" class="form-label">TFA</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="tfaConv" v-model="tfaUnit" class="form-select border-info">
                            <option>sq.inch</option>
                            <option>sq.mm</option>
                        </select>
                    </div>
                </div>


            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Bit Nozzle Velocity</span>
                        <h3 class="text-center text-success">{{ bitNozzleVel }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="bitNozzleVelUnit">
                                <option>ft/sec</option>
                                <option>m/sec</option>
                            </select>
                        </span>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
