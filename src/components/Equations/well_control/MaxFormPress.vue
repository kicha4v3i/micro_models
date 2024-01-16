<script setup>
import { ref, computed } from 'vue';
import store from '@/store'

// Data
const ktf = ref('')
const tvd = ref('')

// Units
const ktfUnit = ref('ppg')
const tvdUnit = ref('ft')
const maxFormPressUnit = ref('psi')

// Conversions
const ktfConv = computed(() => {
    if (ktfUnit.value == 'ppg') {
        ktf.value = (ktf.value * 8.33).toFixed(2)
    } else {
        ktf.value = (ktf.value / 8.33).toFixed(2)
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
const maxFormPress = computed(() => {
    
    // Base Units
    let ktfBaseUnit
    let tvdBaseUnit
    let mwBaseUnit

    if (ktfUnit.value == 'g/cc') {
        ktfBaseUnit = ktf.value * 8.33
    } else {
        ktfBaseUnit = ktf.value
    }

    if (tvdUnit.value == 'm') {
        tvdBaseUnit = tvd.value * 3.281
    } else {
        tvdBaseUnit = tvd.value
    }

    if (store.inputUnits.mwUnit == 'g/cc') {
        mwBaseUnit = store.mainInputs.mw * 8.33
    } else {
        mwBaseUnit = store.mainInputs.mw
    }
  
    // Calculations
    if (ktf.value == '' || tvd.value == '') {
        return 0
    }
    if (maxFormPressUnit.value == 'psi') {
        return ((parseFloat(ktfBaseUnit) + parseFloat(mwBaseUnit)) * 0.052 * tvdBaseUnit).toFixed(0)
    } else {
        return (((parseFloat(ktfBaseUnit) + parseFloat(mwBaseUnit)) * 0.052 * tvdBaseUnit) / 0.145).toFixed(0)
    }
    
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <h3 class="fs-5 ms-5">Max Formation Pressure</h3>

                <!-- Kick Tolerance Factor -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="ktf" step="0.01" placeholder="Kick Tolerance Factor" v-model="ktf">
                        <label for="ktf" class="form-label">Kick Tolerance Factor</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="ktfConv" v-model="ktfUnit" class="form-select border-info">
                            <option>ppg</option>
                            <option>g/cc</option>
                        </select>
                    </div>
                </div>

                <!-- Hole TVD -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="tvd" step="1" placeholder="Hole TVD" v-model="tvd">
                        <label for="tvd" class="form-label">Hole TVD</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="tvdConv" v-model="tvdUnit" class="form-select border-info">
                            <option>ft</option>
                            <option>m</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Max Formation Pressure</span>
                        <h3 class="text-center text-success">{{ maxFormPress }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="maxFormPressUnit">
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