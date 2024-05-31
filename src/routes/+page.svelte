<script lang="ts">
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';

	import { someState } from '$lib/someState.svelte';

	//let factor = $state(1);

	const changeTypeFilter = (t: string) => {
		return () => {
			const index = someState.filter.types.indexOf(t);
			if (index > -1) {
				someState.filter.types.splice(index, 1);
			} else {
				someState.filter.types.push(t);
			}
		};
	};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		{#if someState.loading}LOADING{/if}
	</h1>
	<h1>
		{#if someState.loaded}LOADED{/if}
	</h1>
	<div>
		<h3>Filter</h3>
		<label>Weight:<input type="number" bind:value={someState.filter.weight} /></label>
		<h4>Types:</h4>
		<div>
			<label
				>electric<input
					type="checkbox"
					checked={someState.filter.types.includes('electric')}
					onchange={changeTypeFilter('electric')}
				/>
			</label>
			<label
				>normal<input
					type="checkbox"
					checked={someState.filter.types.includes('normal')}
					onchange={changeTypeFilter('normal')}
				/></label
			>
			<label
				>grass<input
					type="checkbox"
					checked={someState.filter.types.includes('grass')}
					onchange={changeTypeFilter('grass')}
				/></label
			>
			<label
				>poison<input
					type="checkbox"
					checked={someState.filter.types.includes('poison')}
					onchange={changeTypeFilter('poison')}
				/></label
			>
			<label
				>bug<input
					type="checkbox"
					checked={someState.filter.types.includes('bug')}
					onchange={changeTypeFilter('bug')}
				/></label
			>
		</div>
	</div>
	<h1>All Pokemon (total mass: {someState.totalMass})</h1>
	<ul>
		{#each someState.fetchedData as p}
			<li>
				{p.name} - weighs {p.weight} - (types: {p.types.reduce((s, t) => {
					return (s += t.type.name + ', ');
				}, '')})
			</li>
		{/each}
	</ul>
	<h1>Filtered Pokemon (total mass: {someState.filteredTotalMass})</h1>
	<ul>
		{#each someState.filteredPokemon as p}
			<li>{p.name} - weighs {p.weight}</li>
		{/each}
	</ul>

	<h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcome_fallback} alt="Welcome" />
			</picture>
		</span>

		to your new<br />SvelteKit app
	</h1>

	<h2>
		try editing <strong>src/routes/+page.svelte</strong>
	</h2>

	<Counter />
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
</style>
