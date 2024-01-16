<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Data
const rop = ref('')
const porosity = ref('')

// Units
const ropUnit = ref('ft/hr')
const cutVolUnit = ref('bbls/hr')

// Conversions
const ropConv = computed(() => {
    if (ropUnit.value == 'ft/hr') {
        rop.value = (rop.value * 3.281).toFixed(2)
    } else {
        rop.value = (rop.value / 3.281).toFixed(2)
    }
})

// Base Units
const ropBaseUnit = computed(() => {
    if (ropUnit.value == 'm/hr') {
        return rop.value * 3.281
    } else {
        return rop.value
    }
})

const dbBaseUnit = computed(() => {
    if (store.inputUnits.bitSizeUnit == 'mm') {
        return store.mainInputs.bitSize / 1000 * 3.281 * 12
    } else {
        return store.mainInputs.bitSize
    }
})

// Calculations
const cutVol = computed(() => {
    if (cutVolUnit.value == 'bbls/hr') {
        return ((1 - porosity.value / 100) * dbBaseUnit.value**2 * ropBaseUnit.value / 1029.4).toFixed(1)
    } else {
        return (((1 - porosity.value / 100) * dbBaseUnit.value**2 * ropBaseUnit.value / 1029.4) * 42 / 60).toFixed(1)
    }
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <!-- Rate of Penetration -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="rop" step="1" placeholder="Rate of Penetration" v-model="rop">
                        <label for="rop" class="form-label">Rate of Penetration</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="ropConv" v-model="ropUnit" class="form-select border-info">
                            <option>ft/hr</option>
                            <option>m/hr</option>
                        </select>
                    </div>
                </div>

                <!-- Porosity -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="porosity" step="1" placeholder="Porosity" v-model="porosity">
                        <label for="porosity" class="form-label">Porosity</label>
                    </div>
                    <span class="align-baseline text-secondary fs-6 ms-3">%</span>
                </div>
            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Cuttings Volume</span>
                        <h3 class="text-center text-success">{{ cutVol }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="cutVolUnit">
                                <option>bbls/hr</option>
                                <option>gpm</option>
                            </select>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>