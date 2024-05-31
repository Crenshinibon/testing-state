import config from './config.json';

interface Data {
	some: string;
	number: number;
	pokemon: string;
}

interface PokemonType {
	slot: number;
	type: {
		name: string;
		url: string;
	};
}

interface Pokemon {
	height: number;
	weight: number;
	order: number;
	name: string;
	types: PokemonType[];
}

interface Filter {
	weight: number;
	types: string[];
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
		console.log(p);
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
	public filter: Filter = $state({
		weight: 49,
		types: ['poison', 'grass', 'bug', 'electric', 'normal']
	});
	public loading: boolean = $state(false);
	public fetchedData: Pokemon[] = $state([]);
	public loaded: boolean = $state(false);
	public filteredPokemon: Pokemon[] = $derived(
		this.fetchedData.filter((p) => {
			let matchingType = false;
			for (let i = 0; i < p.types.length; i++) {
				if (this.filter.types.includes(p.types[i].type.name)) {
					matchingType = true;
					break;
				}
			}

			return p.weight > this.filter.weight && matchingType;
		})
	);
	public totalMass: number = $derived(
		this.fetchedData.reduce((s, r) => {
			s += r.weight; // * this.factor;
			return s;
		}, 0)
	);
	public filteredTotalMass: number = $derived(
		this.filteredPokemon.reduce((s, r) => {
			s += r.weight; // * this.factor;
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
