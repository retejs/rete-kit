<script lang="ts">
	import welcome from "$lib/images/svelte-welcome.webp";
	import welcome_fallback from "$lib/images/svelte-welcome.png";

	import "./styles.css";
	import { onMount } from "svelte";
	let el: HTMLElement;

	onMount(async () => {
		const { createEditor } = await import("../rete");
		createEditor(el);
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcome_fallback} alt="Welcome" />
			</picture>
		</span>

		to your new<br />SvelteKit + Rete.js app
	</h1>

	<div class="rete" bind:this={el} />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
		max-width: 50rem;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}

	.rete {
		position: relative;
		width: 80vw;
		height: 90vh;
		font-size: 1rem;
		background: white;
		margin: 1em auto;
		border-radius: 1em;
		text-align: left;
		border: 1px solid #cbd0db;
	}
</style>
