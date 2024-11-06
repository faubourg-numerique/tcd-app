<script setup lang="ts">
import swal from "sweetalert2";

import { useI18n } from "vue-i18n";

import { useOperationStore } from "@/stores/operation-store";

const operationStore = useOperationStore();

const { t } = useI18n();

async function runOperation(operationParametersId: string) {
    try {
        await operationStore.runOperation(operationParametersId);
    } catch (error) {
        await swal.fire({
            icon: "error",
            title: t("dialogs.operationRunErrorTitle"),
            text: t("dialogs.operationRunErrorText"),
        });
        return;
    }

    await swal.fire({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        icon: "success",
        title: "Commande envoyée"
    });
}

const sessionEndDate = new Date();
sessionEndDate.setMinutes(sessionEndDate.getMinutes() + 10);

const sessionInterval = setInterval(() => {
    const date = new Date();
    if (date > sessionEndDate) {
        clearInterval(sessionInterval);

        swal.fire({
            showConfirmButton: false,
            allowOutsideClick: false,
            icon: "info",
            title: "Session terminée",
            text: "Cette session est terminée, veuillez scanner de nouveau le QR code pour en obtenir une nouvelle. Vous pouvez fermer cette page."
        });
    }
}, 1000);
</script>

<template>
    <div class="container">
        <div class="row mt-3 mb-5">
            <div class="col text-center">
                <img style="height: 80px;" alt="Somme Numérique" src="@/assets/images/logos/somme-numerique-2.png" />
            </div>
            <div class="col text-center">
                <img style="height: 80px;" alt="Somme Numérique" src="@/assets/images/logos/faubourg-numerique.png" />
            </div>
        </div>
        <div class="mb-5">
            <p class="h5 mb-3">💧 Cours d'eau</p>
            <div class="row">
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100" @click="runOperation('urn:ngsi-ld:OperationParameters:e5debc5c-95a5-4b3a-81de-ddc568b0d289')">0%</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100" @click="runOperation('urn:ngsi-ld:OperationParameters:3fc14568-5693-4d9b-8380-eee3eab0c8ce')">25%</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100" @click="runOperation('urn:ngsi-ld:OperationParameters:93d0ac43-0c73-4851-9262-e37b444c9d12')">50%</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100" @click="runOperation('urn:ngsi-ld:OperationParameters:b98d6233-7886-4a3d-89c4-580880b81eff')">75%</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100" @click="runOperation('urn:ngsi-ld:OperationParameters:f6ebdbc9-4f4e-4224-9430-d42454e695c9')">100%</button>
                </div>
            </div>
        </div>
        <div class="mb-5">
            <p class="h5 mb-3">💡 Éclairage</p>
            <div class="row">
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100" @click="runOperation('urn:ngsi-ld:OperationParameters:209d923c-7cba-4e33-a9a3-e6271ea293cd')">Allumer</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100" @click="runOperation('urn:ngsi-ld:OperationParameters:9138a00b-4341-464a-962a-bce328b6729d')">Éteindre</button>
                </div>
            </div>
        </div>
        <div class="mb-5">
            <p class="h5 mb-3">♻️ Points d'apport volontaires</p>
            <div class="row">
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100" @click="runOperation('urn:ngsi-ld:OperationParameters:bbddea53-d46b-4a20-af95-ea16b64341de')">Jeter un sac poubelle</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100" @click="runOperation('urn:ngsi-ld:OperationParameters:a0a0bce5-b328-4a4a-b077-6c343e5b1a2e')">Jeter une bouteille en verre</button>
                </div>
            </div>
        </div>
        <div class="mb-5">
            <p class="h5 mb-3">🔥 Chauffage</p>
            <div class="row">
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100" @click="runOperation('urn:ngsi-ld:OperationParameters:5f274063-2b25-4b3e-9141-a3762a712e18')">16°</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100" @click="runOperation('urn:ngsi-ld:OperationParameters:d66dae3d-ac99-40de-ba62-2bc7e93d1694')">18°</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100" @click="runOperation('urn:ngsi-ld:OperationParameters:e2d73877-4cc1-4bcf-aa6e-313202ad6bfc')">20°</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100" @click="runOperation('urn:ngsi-ld:OperationParameters:0abdecdc-4d27-49c7-83b3-4eeb79540c75')">22°</button>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary w-100" @click="runOperation('urn:ngsi-ld:OperationParameters:e68ab292-cea8-4835-a6f2-c29dce25aa64')">24°</button>
                </div>
            </div>
        </div>
    </div>
</template>
