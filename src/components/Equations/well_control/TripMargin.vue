<script setup>
import { ref, computed } from 'vue';
import store from '@/store'

// Data
const yp = ref('')

// Units
const tripMarginUnit = ref('ppg')

// Calculations
const tripMargin = computed(() => {
    // Base Unit
    let dbBaseUnit
    let dpBaseUnit

    if (store.inputUnits.bitSizeUnit == 'mm') {
        dbBaseUnit = store.mainInputs.bitSize / 1000 * 3.281 * 12
    } else {
        dbBaseUnit = store.mainInputs.bitSize
    }

    if (store.inputUnits.pipeODUnit == 'mm') {
        dpBaseUnit = store.mainInputs.pipeOD / 1000 * 3.281 * 12
    } else {
        dpBaseUnit = store.mainInputs.pipeOD
    }

    // Calculations
    if (tripMarginUnit.value == 'ppg') {
        return (yp.value / (11.7 * (dbBaseUnit - dpBaseUnit))).toFixed(2)
    } else {
        return ((yp.value / (11.7 * (dbBaseUnit - dpBaseUnit))) / 8.33).toFixed(2)
    }

})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <h3 class="fs-5 ms-5">Trip Margin</h3>

                <!-- Gas Gravity -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="yp" step="0.1" placeholder="Yield Point" v-model="yp">
                        <label for="yp" class="form-label">Yield Point</label>
                    </div>
                    <span class="align-baseline text-secondary fs-6 ms-3"><sup>lbs</sup>/<sub>100ft<sup>2</sup></sub></span>
                </div>

            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Trip Margin</span>
                        <h3 class="text-center text-success">{{ tripMargin }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="tripMarginUnit">
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