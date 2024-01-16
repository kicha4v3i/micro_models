<script setup>
import { ref, computed } from 'vue';
import store from '@/store'
</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs w-50">
                <h3 class="fs-5 w-75">Max Surface Pressure from Kick Tolerance Factor</h3>

                <!-- Kick Tolerance Factor -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="formPress" step="1" placeholder="Formation Pressure" v-model="formPress">
                        <label for="formPress" class="form-label">Kick Tolerance Factor</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="formPressConv" v-model="formPressUnit" class="form-select border-info">
                            <option>psi</option>
                            <option>kPa</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>