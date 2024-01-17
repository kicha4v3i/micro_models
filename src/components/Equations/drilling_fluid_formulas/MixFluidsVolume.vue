<script setup>
import { ref, computed } from 'vue'
import store from '@/store'


// Error Handling
const errMsg = ref('')

// Data
const pitLimit = ref(false)
const mudRow = ref([
    {s_no: 1, mw: '', vol: ''},
    {s_no: 2, mw: '', vol: ''}
])
const finalMW = ref('')
const mudVol = ref('')

// Units
const mwUnit = ref('ppg')
const finalMWUnit = ref('ppg')
const mudVolUnit = ref('bbls')
const volUnit = ref('bbls')
const mixedMWUnit = ref('ppg')

// Toggle Pit Limit
const selectMethod = () => {
    pitLimit.value = !pitLimit.value
}

// Add Mud Weight Row
const addRow = () => {
    mudRow.value.push({s_no: mudRow.value.length+1, mw: ''})
}

const deleteRow = () => {
    if (mudRow.value.length > 2) {
        mudRow.value.pop()
    }
}

// Conversions
const finalMWConv = computed(() => {
    if (finalMWUnit.value == 'ppg') {
        finalMW.value = (finalMW.value * 8.33).toFixed(2)
    } else {
        finalMW.value = (finalMW.value / 8.33).toFixed(2)
    }
})

let preMudVol = 'bbls'
const mudVolConv = computed(() => {
    if (preMudVol == 'bbls') {
        if (mudVolUnit.value == 'gal') {
            mudVol.value = (mudVol.value * 42).toFixed(1)
            preMudVol = 'gal'
        } else if (mudVolUnit.value == 'cu.m') {
            mudVol.value = (mudVol.value * 0.1589).toFixed(3)
            preMudVol = 'cu.m'
        } else {
            mudVol.value = (mudVol.value * 5.615).toFixed(3)
            preMudVol = 'cu.ft'
        }
    } else if (preMudVol == 'gal') {
        if (mudVolUnit.value == 'bbls') {
            mudVol.value = (mudVol.value / 42).toFixed(3)
            preMudVol = 'bbls'
        } else if (mudVolUnit.value == 'cu.m') {
            mudVol.value = (mudVol.value * 0.00378).toFixed(3)
            preMudVol = 'cu.m'
        } else {
            mudVol.value = (mudVol.value * 0.13368).toFixed(3)
            preMudVol = 'cu.ft'
        }
    } else if (preMudVol == 'cu.m') {
        if (mudVolUnit.value == 'bbls') {
            mudVol.value = (mudVol.value / 0.1589).toFixed(1)
            preMudVol = 'bbls'
        } else if (mudVolUnit.value == 'gal') {
            mudVol.value = (mudVol.value / 0.00378).toFixed(1)
            preMudVol = 'gal'
        } else {
            mudVol.value = (mudVol.value * 35.3147).toFixed(3)
            preMudVol = 'cu.ft'
        }
    } else {
        if (mudVolUnit.value == 'bbls') {
            mudVol.value = (mudVol.value /5.615).toFixed(1)
            preMudVol = 'bbls'
        } else if (mudVolUnit.value == 'gal') {
            mudVol.value = (mudVol.value / 0.13368).toFixed(1)
            preMudVol = 'gal'
        } else {
            mudVol.value = (mudVol.value / 35.3147).toFixed(3)
            preMudVol = 'cu.m'
        }
    }
})

let preTableMudVol = 'bbls'
const volTableConv = computed(() => {
    console.log(mudRow.value[0])
    if (preTableMudVol == 'bbls') {
        
        if (volUnit.value == 'gal') {
            for (let i=0; i<=mudRow.value.length-1; i++) {
                mudRow.value[i]['vol'] = (mudRow.value[i]['vol'] * 42).toFixed(0)
                console.log(mudRow.value[i]['vol'])
            }
            preTableMudVol = 'gal'
        } else if (volUnit.value == 'cu.m') {
            for (let i=0; i<=mudRow.value.length-1; i++) {
                mudRow.value[i]['vol'] = (mudRow.value[i]['vol'] * 0.1589).toFixed(3)
                console.log(mudRow.value[i]['vol'])
            }
            preTableMudVol = 'cu.m'
        } else {
            for (let i=0; i<=mudRow.value.length-1; i++) {
                mudRow.value[i]['vol'] = (mudRow.value[i]['vol'] * 5.615).toFixed(3)
                console.log(mudRow.value[i]['vol'])
            }
            preTableMudVol = 'cu.ft'
        }
    } else if (preTableMudVol == 'gal') {
        if (volUnit.value == 'bbls') {
            for (let i=0; i<=mudRow.value.length-1; i++) {
                mudRow.value[i]['vol'] = (mudRow.value[i]['vol'] / 42).toFixed(0)
                console.log(mudRow.value[i]['vol'])
            }
            preTableMudVol = 'bbls'
        } else if (volUnit.value == 'cu.ft') {
            for (let i=0; i<=mudRow.value.length-1; i++) {
                mudRow.value[i]['vol'] = (mudRow.value[i]['vol'] * 0.13368).toFixed(3)
                console.log(mudRow.value[i]['vol'])
            }
            preTableMudVol = 'cu.ft'
        } else {
            for (let i=0; i<=mudRow.value.length-1; i++) {
                mudRow.value[i]['vol'] = (mudRow.value[i]['vol'] * 0.00378).toFixed(3)
                console.log(mudRow.value[i]['vol'])
            }
            preTableMudVol = 'cu.m'
        }
    } else if (preTableMudVol == 'cu.ft') {
        if (volUnit.value == 'bbls') {
            for (let i=0; i<=mudRow.value.length-1; i++) {
                mudRow.value[i]['vol'] = (mudRow.value[i]['vol'] / 5.615).toFixed(3)
                console.log(mudRow.value[i]['vol'])
            }
            preTableMudVol = 'bbls'
        } else if (volUnit.value == 'gal') {
            for (let i=0; i<=mudRow.value.length-1; i++) {
                mudRow.value[i]['vol'] = (mudRow.value[i]['vol'] / 0.13368).toFixed(0)
                console.log(mudRow.value[i]['vol'])
            }
            preTableMudVol = 'gal'
        } else {
            for (let i=0; i<=mudRow.value.length-1; i++) {
                mudRow.value[i]['vol'] = (mudRow.value[i]['vol'] / 35.3147).toFixed(0)
                console.log(mudRow.value[i]['vol'])
            }
            preTableMudVol = 'cu.m'
        }
    } else {
        if (volUnit.value == 'bbls') {
            for (let i=0; i<=mudRow.value.length-1; i++) {
                mudRow.value[i]['vol'] = (mudRow.value[i]['vol'] / 0.1589).toFixed(0)
                console.log(mudRow.value[i]['vol'])
            }
            preTableMudVol = 'bbls'
        } else if (volUnit.value == 'gal') {
            for (let i=0; i<=mudRow.value.length-1; i++) {
                mudRow.value[i]['vol'] = (mudRow.value[i]['vol'] / 0.00378).toFixed(0)
                console.log(mudRow.value[i]['vol'])
            }
            preTableMudVol = 'gal'
        } else {
            for (let i=0; i<=mudRow.value.length-1; i++) {
                mudRow.value[i]['vol'] = (mudRow.value[i]['vol'] * 35.3147).toFixed(3)
                console.log(mudRow.value[i]['vol'])
            }
            preTableMudVol = 'cu.ft'
        }
    }
})

const mwTableConv = computed(() => {
    if (mwUnit.value == 'ppg') {
        for (let i=0; i<=mudRow.value.length-1; i++) {
            mudRow.value[i]['mw'] = (mudRow.value[i]['mw'] * 8.33).toFixed(2)
        } 
    } else {
        for (let i=0; i<=mudRow.value.length-1; i++) {
            mudRow.value[i]['mw'] = (mudRow.value[i]['mw'] / 8.33).toFixed(2)
        } 
    }
})

// Calculations

/* Calculate total volume - no Pit limit */
const totVolCalc = computed(() => {
    let vols = []
    if (pitLimit.value == false) {
        for (let i=0; i<=mudRow.value.length-1; i++) {
            vols.push(parseFloat(mudRow.value[i]['vol']))
        }
        let sum = 0
        vols.forEach(num=> {
            sum += num
        })
        mudVol.value = sum
    }
})

const volReq = computed(() => {
    // Base Units
    let mudVolBase
    let finalMWBase
    let totVolBase = []
    let mwBase = []

    if (mudVolUnit.value == 'cu.ft') {
        mudVolBase = mudVol.value / 5.615
    } else if (mudVolUnit.value == 'cu.m') {
        mudVolBase = mudVol.value / 0.1589
    } else if (mudVolUnit.value == 'gal') {
        mudVolBase = mudVol.value / 42
    } else {
        mudVolBase = mudVol.value
    }

    if (finalMWUnit.value == 'ppg') {
        finalMWBase = finalMW.value
    } else {
        finalMWBase = finalMW.value * 8.33
    }

    for (let i=0; i<=mudRow.value.length-1; i++) {
        if (mwUnit.value == 'ppg') {
            mwBase.push(mudRow.value[i]['mw'])
            
        } else {
            mwBase.push(mudRow.value[i]['mw'] * 8.33)
        }
        totVolBase.push(mudRow.value[i]['vol'])
    }

    if (pitLimit.value) {
        let V2 = Math.abs((finalMWBase * mudVolBase - mudVolBase * mwBase[0]) / (mwBase[1] - mwBase[0]))
        let V1 = mudVolBase - V2

        if (mudVolUnit.value == 'bbls') {
            return [V1, V2]
        } else if (mudVolUnit.value == 'gal') {
            console.log(V1, V1*42)
            return [V1 * 42, V2 * 42]
        } else if (mudVolUnit.value == 'cu.ft') {
            return [V1 * 5.615, V2 * 5.615]
        } else {
            return [V1 * 0.1589, V2 * 0.1589]
        }
    } else {
        if (mixedMWUnit.value == 'ppg') {
            return (mwBase[0] * totVolBase[0] + mwBase[1] * totVolBase[1]) / (totVolBase[0] + totVolBase[1])
        } else {
            return ((mwBase[0] * totVolBase[0] + mwBase[1] * totVolBase[1]) / (totVolBase[0] + totVolBase[1])) / 8.33
        }
        
    }
})

</script>
<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-start">
            <div class="inputs w-50">
                <!-- With or Without Pit Limits -->
                <!-- Switch for Pit Limit -->
                <div class="form-check form-switch">
                    <input @click="selectMethod" v-model="pitLimit" class="form-check-input hover-pointer button" type="checkbox" role="switch" id="pitLimit">
                    <label class="form-check-label" for="pitLimit">Limited Pit Volume</label>
                </div>

                <!-- Table of Mud Weights-->
                <div class="border border-dark-subtle rounded bg-light px-4 py-1 mt-3">
                    <p class="fs-5 fw-medium">Existing MWs in Pit</p>
                    <table class="table table-hover table-light">
                        <thead>
                            <tr>
                                <th class="text-center fw-semibold text-secondary">#</th>
                                <th class="text-center fw-semibold text-secondary">Mud Weight <select @change="mwTableConv" v-model="mwUnit">
                                    <option>ppg</option>
                                    <option>g/cc</option>
                                    </select>
                                </th>
                                <th v-if="pitLimit" class="text-center fw-semibold text-secondary">Volume <select disabled>
                                    <option>bbls</option>
                                    <option>cu.ft</option>
                                    <option>cu.m</option>
                                    <option>gal</option>
                                    </select>
                                </th>
                                <th v-else class="text-center fw-semibold text-secondary">Volume <select @change="volTableConv" v-model="volUnit">
                                    <option>bbls</option>
                                    <option>cu.ft</option>
                                    <option>cu.m</option>
                                    <option>gal</option>
                                    </select>
                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in mudRow">
                                <td class="text-center">{{ item.s_no }}</td>
                                <td><input type="number" class="form-control form-control-sm" v-model="item.mw"></td>
                                <td v-if="pitLimit"><input type="number" class="form-control form-control-sm" v-model="item.vol" disabled></td>
                                <td v-else><input @change="totVolCalc" type="number" class="form-control form-control-sm" v-model="item.vol"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Final Mud Weight -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input v-if="!pitLimit" class="form-control" type="number" min="0" id="finalMW" step="0.1" placeholder="Final Weight" v-model="finalMW" disabled>
                        <input v-else class="form-control" type="number" min="0" id="finalMW" step="0.1" placeholder="Final Weight" v-model="finalMW">
                        <label for="finalMW" class="form-label">Mud Weight Required</label>
                    </div>
                    <div class="unit ms-3">
                        <select v-if="!pitLimit" @change="finalMWConv" v-model="finalMWUnit" class="form-select border-info" disabled>
                            <option>ppg</option>
                            <option>g/cc</option>
                        </select>
                        <select v-else @change="finalMWConv" v-model="finalMWUnit" class="form-select border-info">
                            <option>ppg</option>
                            <option>g/cc</option>
                        </select>
                    </div>
                </div>

                <!-- Final Volume of Mud -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input v-if="!pitLimit" readonly class="form-control-plaintext" type="number" min="0" id="mudVolume" step="1" placeholder="Mud Volume" v-model="mudVol">
                        <input v-else class="form-control" type="number" min="0" id="mudVolume" step="1" placeholder="Mud Volume" v-model="mudVol">
                        <label for="mudVolume" class="form-label">Final Volume of Mud</label>
                    </div>
                    <div class="unit ms-3">
                        <div v-if="!pitLimit">{{ volUnit }}</div>
                        <select v-else @change="mudVolConv" v-model="mudVolUnit" class="form-select border-info">
                            <option>bbls</option>
                            <option>cu.ft</option>
                            <option>cu.m</option>
                            <option>gal</option>
                        </select>
                    </div>
                </div>

                
            </div>

            <div class="outputs ms-5">
                <table v-if="pitLimit" class="table">
                    <thead>
                        <tr>
                            <th colspan="2" class="text-center"><span class="text-secondary text-uppercase fs-6">Volume {{ mudVolUnit }}</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><h5 class="text-center text-secondary-emphasis">Mud #1</h5></td>
                            <td><h5 class="text-center text-secondary-emphasis">Mud #2</h5></td>
                        </tr>
                        <tr>
                            <td><h3 class="text-center text-success">{{ Math.ceil(volReq[0]) }}</h3></td>
                            <td><h3 class="text-center text-success">{{ Math.ceil(volReq[1]) }}</h3></td>
                        </tr>
                    </tbody>
                    
                </table>

                <div v-else class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Drilling Fluid Density</span>
                        <h3 class="text-center text-success">{{ volReq.toFixed(2) }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="mixedMWUnit">
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

<style scoped>
.button:hover {
    cursor: pointer;
}
</style>
