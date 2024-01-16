<script setup>
import store from '@/store';
import { ref, computed } from 'vue'

// Data
const TFA = ref('')
const Cd = ref(0.95)

// Units
const tfaUnit = ref('sq.inch')
const bitPressureLossUnit = ref('psi')

// Conversions
const tfaConv = computed(() => {
    if (tfaUnit.value == 'sq.inch') {
        TFA.value = (TFA.value / 645.16).toFixed(2)
    } else {
        TFA.value = (TFA.value * 645.16).toFixed(2)
    }
})

// Calculations
const bitPressureLoss = computed(() => {
    let qBaseUnit
    let mwBaseUnit
    let tfaBaseUnit

    if (store.inputUnits.flowrateUnit == 'lpm') {
        qBaseUnit = store.mainInputs.flowrate / 3.7854
    } else {
        qBaseUnit = store.mainInputs.flowrate
    }

    if (store.inputUnits.mwUnit == 'g/cc') {
        mwBaseUnit = store.mainInputs.mw * 8.33
    } else {
        mwBaseUnit = store.mainInputs.mw
    }

    if (tfaUnit.value == 'sq.inch') {
        tfaBaseUnit = TFA.value
    } else {
        tfaBaseUnit = TFA.value * 0.00155
    }

    if (bitPressureLossUnit.value == 'psi') {
        return (mwBaseUnit * qBaseUnit **2 / (12032 * Cd.value**2 * tfaBaseUnit**2)).toFixed(0)
    } else {
        return ((mwBaseUnit * qBaseUnit **2 / (12032 * Cd.value**2 * tfaBaseUnit**2)) / 0.145).toFixed(0)
    }

})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <h3 class="fs-5 ms-5">Pressure Drop across Bit</h3>

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

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="Cd" step="0.01" placeholder="Cd" v-model="Cd">
                        <label for="Cd" class="form-label">Discharge Coefficient</label>
                    </div>
                </div>

            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Bit Pressure Loss</span>
                        <h3 class="text-center text-success">{{ bitPressureLoss }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="bitPressureLossUnit">
                                <option>psi</option>
                                <option>kPa</option>
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