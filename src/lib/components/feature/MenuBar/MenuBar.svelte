<script lang="ts">
    import * as Menubar from '$lib/components/ui/menubar/index.js';
    import * as Kbd from "$lib/components/ui/kbd/index.js";
    import {Button} from "$lib/components/ui/button";
    import {X, Minus, Square} from "@lucide/svelte"

    import {getCurrentWindow, Window} from "@tauri-apps/api/window";
    import {onMount} from "svelte";
		import { toggleMode } from 'mode-watcher';

    let appWindow : Window;

    onMount(() => {
        appWindow = getCurrentWindow();
        console.log(appWindow);
    })

    function minimizeWindow(){
        appWindow.minimize();
    }

    function toggleMaximizeWindow(){
        appWindow.toggleMaximize();
    }

    function closeWindow(){
        appWindow.close();
    }
</script>

<div class="bg-background border-b" data-tauri-drag-region>
    <div class="flex items-center justify-between gap-4 pr-2">
        <div class="flex items-center gap-4 px-4 py-2">
            <img src="/logo/svide.svg" alt="svide" class="h-6 w-6" />

            <Menubar.Root class="border-0 bg-transparent">
                <Menubar.Menu>
                    <Menubar.Trigger>File</Menubar.Trigger>
                    <Menubar.Content>
                        <Menubar.Item>
                            New File
                            <Menubar.Shortcut>
                                <Kbd.Root>⌘</Kbd.Root>
                                <Kbd.Root>N</Kbd.Root>
                            </Menubar.Shortcut>
                        </Menubar.Item>
                        <Menubar.Separator />
                        <Menubar.Item>Exit</Menubar.Item>
                    </Menubar.Content>
                </Menubar.Menu>
            </Menubar.Root>
        </div>

        <div class="flex items-center">
            <Button variant="ghost" size="icon" onclick={() => minimizeWindow()}><Minus/></Button>
            <Button variant="ghost" size="icon" onclick={() => toggleMaximizeWindow()}><Square/></Button>
            <Button variant="ghost" size="icon" onclick={() => closeWindow()}><X/></Button>
        </div>
    </div>
</div>

<style>
    *[data-tauri-drag-region] {
        app-region: drag;
    }
</style>