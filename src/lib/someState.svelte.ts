import config from './config.json';

interface Data {
	some: string;
	number: number;
	pokemon: string;
}

interface Pokemon {
	height: number;
	weight: number;
	order: number;
	name: string;
}

const fetchResource = async (pokemon: string): Promise<Pokemon> => {
	const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
	const resp = await fetch(url);
	//introduce some random timeout
	return new Promise((res) => {
		setTimeout(async () => {
			const pokemonData = (await resp.json()) as Pokemon;
			res(pokemonData);
		}, Math.random() * 1000);
	});
};

const loadData = async (someState: SomeStateClass) => {
	let done = 0;
	for (let i = 0; i < someState.rawData.length; i++) {
		const rd = someState.rawData[i]; //.map(async (rd) => {
		const p = await fetchResource(rd.pokemon);
		someState.fetchedData.push(p);
		done++;
		if (done == someState.rawData.length) {
			someState.loaded = true;
			someState.loading = false;
		}
	}
};

class SomeStateClass {
	public rawData: Data[] = $state([]);

	public loading: boolean = $state(false);
	public fetchedData: Pokemon[] = $state([]);
	public loaded: boolean = $state(false);
	public totalMass: number = $derived(
		this.fetchedData.reduce((s, r) => {
			s += r.weight;
			return s;
		}, 0)
	);
	constructor(d: Data[]) {
		this.loading = true;
		this.rawData = d;
		loadData(this);
	}
}

export const someState: SomeStateClass = new SomeStateClass(config);
