abstract class User {
	private static NUM_USUARIOS = 0; 
	protected readonly id: number;
	protected readonly data: string;
	public projetos: Array<string> = [];

	constructor(
		public nome: string,
		protected senha: string,
	) {
		User.NUM_USUARIOS++;
		this.id = User.NUM_USUARIOS;
		this.data = new Date().toLocaleString("pt-br", {timeZone: "America/Sao_Paulo"});
	}

	// setters
	set modificarNome(setNome: string) {
		this.nome = setNome;
	}

	set modificarSenha(setSenha: string) {
		this.senha = setSenha;
	}

	// getters
	abstract get verDados(): object;

	get verProjetosAlocado(): Array<string> {
		return this.projetos;
	}

	get pegarSenha(): string {
		return this.senha;
	}

	// avançar com um projeto
}

class Consultor extends User {
	public cargo = 'Consultor';
	constructor(
		nome: string,
		senha: string,
	) {
		super(nome, senha);
	}

	get verDados(): object {
		const dados = {
			id: this.id,
			nome: this.nome,
			cargo: this.cargo,
			projetos: this.projetos,
			data_de_criacao: this.data
		};

		return dados;
	}
	// avançar com um projeto
	// pedir retirada de um projeto
}

class Gerente extends User {
	public cargo = 'Gerente';
	constructor(
		nome: string,
		senha: string,
	) {
		super(nome, senha);
	}

	get verDados(): object {
		const dados = {
			id: this.id,
			nome: this.nome,
			cargo: this.cargo,
			projetos: this.projetos,
			data_de_criacao: this.data
		};

		return dados;
	}
	// avançar com um projeto
	// dar aval sobre a retirada de um consultor
	// passar o projeto a outro gerente
	// entregar um projeto
}

class Projeto {
	private static numProjetos = 0;
	protected readonly id: number;
	protected readonly dataCriacao: string;

	constructor(
		public nome: string,
		public gerenteResponsavel: string,
		public etapasDesenvolvimento: number,
		public etapasConcepcao: number,
		public etapasIdVisual: number
	) {
		Projeto.numProjetos++;
		this.id = Projeto.numProjetos;
		this.dataCriacao = new Date().toLocaleString("pt-br", {timeZone: "America/Sao_Paulo"});
	}
}

interface IPedidoAvanco {
	nomeProjeto: string,
	etapa: string
}

interface IPedidoRetirada{
	nomeConsultor: string,
	nomeProjeto: string
}

abstract class Sistema {
	static GERENTES: Array<Gerente> = [];
	static CONSULTORES: Array<Consultor> = [];
	static PROJETOS: Array<Projeto> = [];
	static PEDIDOS_AVANCO: Array<IPedidoAvanco> = [];
	static PEDIDOS_RETIRADA: Array<IPedidoRetirada> = [];
	static PROJETOS_CONCLUIDOS: Array<Projeto> = [];

	static mostrarMenu() {
		console.log("Escolha uma opção: ");
		console.log(
			"1. Criar projeto\n" + 
			"2. Remover projeto\n" + 
			"3. Criar consultor\n" +
			"4. Remover consultor\n" + 
			"5. Criar gerente\n" +
			"6. Remover gerente\n" +
			"7. Listar projetos\n" +
			"8. Listar consultores\n" +
			"9. Listar gerentes\n" +
			"10. Fazer login\n" +
			"11. Sair do programa\n"
		)
	}

	static pegarInput() {
		const entrada = require("prompt-sync")({sigint: true});
		return entrada("> ");
	}

	static criarProjeto() {
		console.clear();
		console.log("Criando um projeto...")
		console.log("(Digite a letra \"m\" para voltar ao menu)");

		if (this.GERENTES.length == 0) {
			console.log("Não há gerentes, por favor retornar ao menu.");
			while (true) {
				const entrada = String(this.pegarInput());
				if (entrada == "m") return;
			}
		}

		console.log("Nome do projeto: ");
		const nome = String(this.pegarInput());
		if (nome == "m") return;

		console.log("Nome do gerente responsável: ");
		const gerenteResponsavel = String(this.pegarInput());
		
		for (let i = 0; this.GERENTES.length > i; i++) {
			if (this.GERENTES[i].nome == gerenteResponsavel) {
				this.GERENTES[i].projetos.push(nome);
				break;
			} else if (i == this.GERENTES.length - 1) {
				console.log("Gerente não encontrado, por favor tente de novo.");
				while (true) {
					const entrada = String(this.pegarInput());
					if (entrada == "m") return;
				}
			} else if (gerenteResponsavel == "m") return;
		}

		console.log("Número de consultores alocados: ");
		const numConsultores = String(this.pegarInput());
		if (numConsultores == "m") return;

		for (let i = 0; Number(numConsultores) > i; i++) {
			console.log(`Nome so consultor ${i + 1}: `);
			const consultorNome = String(this.pegarInput());

			for (let j = 0; this.CONSULTORES.length > j; j++) {
				if (this.CONSULTORES[j].nome == consultorNome) {
					this.CONSULTORES[j].projetos.push(nome);
					break;
				} else if (j == this.CONSULTORES.length - 1) {
					console.log("Consultor não encontrado, por favor tente de novo.");
					i--;
				} else if (consultorNome == "m") return;
			}
		}
		
		console.log("Número de etapas de desenvolvimento: ");
		const etapasDesenvolvimento = String(this.pegarInput());
		if (etapasDesenvolvimento == "m") return;

		console.log("Número de etapas de concepção: ");
		const etapasConcepcao = String(this.pegarInput());
		if (etapasConcepcao == "m") return;

		console.log("Número de etapas de identidade visual: ");
		const etapasIdVisual = String(this.pegarInput());
		if (etapasIdVisual == "m") return;

		const novoProjeto = new Projeto(nome, gerenteResponsavel, Number(etapasDesenvolvimento), Number(etapasConcepcao), Number(etapasIdVisual));
		this.PROJETOS.push(novoProjeto);
	}

	static avancarProjetoConsultor(index: number) {
		console.clear();
		console.log("Fazendo pedido de avanço de projeto...")
		console.log("(Digite a letra \"m\" para voltar ao menu)");

		console.log("Nome do Projeto: ");
		const nome = String(this.pegarInput());
		if (nome == "m") return;

		console.log("Etapa: (c = concepção, d = desenvolvimento, i = identidade visual)");
		const etapa = String(this.pegarInput());
		if (etapa == "m") return;

		const avanco = {
			nomeProjeto: nome,
			etapa: etapa
		}

		this.PEDIDOS_AVANCO.push(avanco);
	}

	static avancarProjetoGerente(index: number) {
		console.clear();
		console.log("Avançando projeto...")
		console.log("(Digite a letra \"m\" para voltar ao menu)");

		for (let i = 0; this.PEDIDOS_AVANCO.length > i; i++) {
			for (let j = 0; this.GERENTES[index].projetos.length > j; j++) {
				if (this.GERENTES[index].projetos[j] == this.PEDIDOS_AVANCO[i].nomeProjeto) {
					console.log(this.PEDIDOS_AVANCO[i]);
					console.log("Avançar projeto? (s/n) ");
					const resposta = String(this.pegarInput());
					if (resposta == "s") {
						for (let k = 0; this.PROJETOS.length > k; k++) {
							if (this.PROJETOS[k].nome == this.GERENTES[index].projetos[j]) {
								if (this.PEDIDOS_AVANCO[i].etapa == "c") {
									this.PROJETOS[k].etapasConcepcao--;
									break;
								} else if (this.PEDIDOS_AVANCO[i].etapa == "d") {
									this.PROJETOS[k].etapasDesenvolvimento--;
									break;
								} else if (this.PEDIDOS_AVANCO[i].etapa == "i") {
									this.PROJETOS[k].etapasIdVisual--;
									break;
								}
							}
						}
					} else if (resposta == "n") {
						if (i == 0) {
							this.PEDIDOS_AVANCO.shift();
							break;
						} else {
							this.PEDIDOS_AVANCO.splice(i, i);
							break;
						}
					} else {
						return;
					}
				}
			}
		}
	}

	static pedirRetirada(index: number) {
		console.clear();
		console.log("Fazendo pedido de retirada de projeto...")
		console.log("(Digite a letra \"m\" para voltar ao menu)");

		console.log("Nome do Projeto: ");
		const nome = String(this.pegarInput());
		if (nome == "m") return;

		const retirada = {
			nomeConsultor: this.CONSULTORES[index].nome,
			nomeProjeto: nome
		}

		this.PEDIDOS_RETIRADA.push(retirada);
	}

	static passarProjeto(index: number) {
		console.clear();
		console.log("Passar um projeto...")
		console.log("(Digite a letra \"m\" para voltar ao menu)");

		if (this.GERENTES.length == 0) {
			console.log("Não há gerentes, por favor retornar ao menu.");
				while (true) {
					const entrada = String(this.pegarInput());
					if (entrada == "m") return;
				}
		}

		console.log("Nome do projeto: ");
		const nome = String(this.pegarInput());
		if (nome == "m") return;

		console.log("Nome do novo gerente responsável: ");
		const gerenteResponsavel = String(this.pegarInput());
		
		for (let i = 0; this.GERENTES.length > i; i++) {
			if (this.GERENTES[i].nome == gerenteResponsavel) {
				for (let j = 0; this.PROJETOS.length > j; j++) {
					if (this.PROJETOS[j].nome == nome) {
						this.GERENTES[i].projetos.push(nome);
						this.PROJETOS[j].gerenteResponsavel = gerenteResponsavel;
						break;
					} else if (j == this.PROJETOS.length - 1) {
						console.log("Projeto não encontrado, por favor retornar ao menu.");
						while (true) {
							const entrada = String(this.pegarInput());
							if (entrada == "m") return;
						}
					}
				}
				for (let j = 0; this.GERENTES[index].projetos.length > j; j++) {
					if (j == 0 && this.GERENTES[index].projetos[j] == nome) {
						this.GERENTES[index].projetos.shift();
						break;
					} else if (this.GERENTES[index].projetos[j] == nome) {
						this.GERENTES[index].projetos.splice(i, i);
						break;
					}
				}
				break;
			} else if (i == this.GERENTES.length - 1) {
				console.log("Gerente não encontrado, por favor retornar ao menu.");
				while (true) {
					const entrada = String(this.pegarInput());
					if (entrada == "m") return;
				}
			} else if (gerenteResponsavel == "m") return;
		}
	}

	static entregarProjeto() {
		console.clear();
		console.log("Entregar projeto...")
		console.log("(Digite a letra \"m\" para voltar ao menu)");

		for (let i = 0; this.PROJETOS.length > i; i++) {
			if (this.PROJETOS[i].etapasConcepcao == 0 && this.PROJETOS[i].etapasDesenvolvimento == 0 && this.PROJETOS[i].etapasIdVisual == 0)	{
				console.log(this.PROJETOS[i]);
				console.log("Entregar projeto? (s/n) ");
				const resposta = String(this.pegarInput());
				if (resposta == "s") {
					this.PROJETOS_CONCLUIDOS.push(this.PROJETOS[i]);
					for (let j = 0; this.CONSULTORES.length > j; j++) {
						for (let k = 0; this.CONSULTORES[j].projetos.length > k; k++) {
							if (k == 0 && this.CONSULTORES[j].projetos[k] == this.PROJETOS[i].nome) {
								this.CONSULTORES[j].projetos.shift();
								break;
							} else if (this.CONSULTORES[j].projetos[k] == this.PROJETOS[i].nome) {
								this.CONSULTORES[j].projetos.splice(k, k);
								break;
							}
						}
					}
					for (let j = 0; this.GERENTES.length > j; j++) {
						for (let k = 0; this.GERENTES[j].projetos.length > k; k++) {
							if (k == 0 && this.GERENTES[j].projetos[k] == this.PROJETOS[i].nome) {
								this.GERENTES[j].projetos.shift();
								break;
							} else if (this.GERENTES[j].projetos[k] == this.PROJETOS[i].nome) {
								this.GERENTES[j].projetos.splice(k, k);
								break;
							}
						}
					}
					if (i == 0) {
						this.PROJETOS.shift();
					} else {
						this.PROJETOS.splice(i, i);
					}
				} else if (resposta == "n") {
					continue;
				} else {
					return;
				}
			} else if (i == this.PROJETOS.length - 1) {
				console.log("Não existem mais projetos prontos.");
				while (true) {
					const entrada = String(this.pegarInput());
					if (entrada == "m") return;
				}
			}
		}
	}

	static removerProjeto() {
		console.clear();
		console.log("Removendo um projeto...")
		console.log("(Digite a letra \"m\" para voltar ao menu)");

		console.log("Nome do projeto: ");
		const nome = String(this.pegarInput());
		if (nome == "m") return;

		for (let i = 0; this.PROJETOS.length > i; i++) {
			if (i == 0 && this.PROJETOS[i].nome == nome) {
				this.PROJETOS.shift();
				break;
			} else if (this.PROJETOS[i].nome == nome) {
				this.PROJETOS.splice(i, i);
				break;
			}
		}

		for (let i = 0; this.CONSULTORES.length > i; i++) {
			for (let j = 0; this.CONSULTORES[i].projetos.length > j; j++) {
				if (j == 0 && this.CONSULTORES[i].projetos[j] == nome) {
					this.CONSULTORES[i].projetos.shift();
					break;
				} else if (this.CONSULTORES[i].projetos[j] == nome) {
					this.CONSULTORES[i].projetos.splice(j, j);
					break;
				}
			}
		}

		for (let i = 0; this.GERENTES.length > i; i++) {
			for (let j = 0; this.GERENTES[i].projetos.length > j; j++) {
				if (j == 0 && this.GERENTES[i].projetos[j] == nome) {
					this.GERENTES[i].projetos.shift();
					break;
				} else if (this.GERENTES[i].projetos[j] == nome) {
					this.GERENTES[i].projetos.splice(j, j);
					break;
				}
			}
		}
	}

	static criarConsultor() {
		console.clear();
		console.log("Criando um consultor...")
		console.log("(Digite a letra \"m\" para voltar ao menu)");

		console.log("Nome do consultor: ");
		const nome = String(this.pegarInput());
		if (nome == "m") return;

		console.log("Senha: ");
		const senha = String(this.pegarInput());
		if (senha == "m") return;

		const novoConsultor = new Consultor(nome, senha);
		this.CONSULTORES.push(novoConsultor);
	}

	static retirarConsultor(index: number) {
		console.clear();
		console.log("Retirando consultor de projeto...")
		console.log("(Digite a letra \"m\" para voltar ao menu)");

		for (let i = 0; this.PEDIDOS_RETIRADA.length > i; i++) {
			for (let j = 0; this.GERENTES[index].projetos.length > j; j++) {
				if (this.GERENTES[index].projetos[j] == this.PEDIDOS_RETIRADA[i].nomeProjeto) {
					console.log(this.PEDIDOS_RETIRADA[i]);
					console.log("Retirar consultor? (s/n) ");
					const resposta = String(this.pegarInput());
					if (resposta == "s") {
						for (let k = 0; this.CONSULTORES.length > k; k++) {
							if (this.PEDIDOS_RETIRADA[i].nomeConsultor == this.CONSULTORES[k].nome) {
								for (let p = 0; this.CONSULTORES[k].projetos.length > p; p++) {
									if (this.PEDIDOS_RETIRADA[i].nomeProjeto == this.CONSULTORES[k].projetos[p]) {
										if (p == 0) {
											this.CONSULTORES[k].projetos.shift();
											break;
										} else {
											this.CONSULTORES[k].projetos.splice(p, p);
											break;
										}
									}
								}
							}
						}
					} else if (resposta == "n") {
						if (i == 0) {
							this.PEDIDOS_RETIRADA.shift();
							break;
						} else {
							this.PEDIDOS_RETIRADA.splice(i, i);
							break;
						}
					} else {
						return;
					}
				}
			}
		}
	}

	static modificarConsultorDados(index: number) {
		console.clear();
		console.log("Modificando seus dados...")
		console.log("(Digite a letra \"m\" para voltar ao menu)");

		console.log("Nome do consultor: ");
		const nome = String(this.pegarInput());
		if (nome == "m") return;

		console.log("Senha: ");
		const senha = String(this.pegarInput());
		if (senha == "m") return;

		this.CONSULTORES[index].modificarNome = nome;
		this.CONSULTORES[index].modificarSenha = senha;
	}

	static removerConsultor() {
		console.clear();
		console.log("Removendo um consultor...")
		console.log("(Digite a letra \"m\" para voltar ao menu)");

		console.log("Nome do consultor: ");
		const nome = String(this.pegarInput());
		if (nome == "m") return;

		for (let i = 0; this.CONSULTORES.length > i; i++) {
			if (i == 0 && this.CONSULTORES[i].nome == nome) {
				this.CONSULTORES.shift();
				break;
			} else if (this.CONSULTORES[i].nome == nome) {
				this.CONSULTORES.splice(i, i);
				return;
			}
		}
	}

	static criarGerente() {
		console.clear();
		console.log("Criando um gerente...")
		console.log("(Digite a letra \"m\" para voltar ao menu)");

		console.log("Nome do gerente: ");
		const nome = String(this.pegarInput());
		if (nome == "m") return;

		console.log("Senha: ");
		const senha = String(this.pegarInput());
		if (senha == "m") return;

		const novoGerente = new Gerente(nome, senha);
		this.GERENTES.push(novoGerente);
	}

	static modificarGerenteDados(index: number) {
		console.clear();
		console.log("Modificando seus dados...")
		console.log("(Digite a letra \"m\" para voltar ao menu)");

		console.log("Nome do gerente: ");
		const nome = String(this.pegarInput());
		if (nome == "m") return;

		console.log("Senha: ");
		const senha = String(this.pegarInput());
		if (senha == "m") return;

		this.GERENTES[index].modificarNome = nome;
		this.GERENTES[index].modificarSenha = senha;
	}

	static removerGerente() {
		console.clear();
		console.log("Removendo um gerente...")
		console.log("(Digite a letra \"m\" para voltar ao menu)");

		console.log("Nome do gerente: ");
		const nome = String(this.pegarInput());
		if (nome == "m") return;

		for (let i = 0; this.GERENTES.length > i; i++) {
			if (i == 0 && this.GERENTES[i].nome == nome && this.GERENTES[i].projetos.length == 0) {
				this.GERENTES.shift();
				break;
			} else if (this.GERENTES[i].nome == nome && this.GERENTES[i].projetos.length == 0) {
				this.GERENTES.splice(i, i);
				return;
			} else if (this.GERENTES[i].nome == nome && this.GERENTES[i].projetos.length != 0) {
				console.log("Não deve existir projeto sem gerente, por favor retornar ao menu.");
				while (true) {
					const entrada = String(this.pegarInput());
					if (entrada == "m") return;
				}
			}
		}
	}

	static listarProjetos() {
		console.clear();
		console.log("Lista de projetos: ")
		console.log("(Digite a letra \"m\" para voltar ao menu)");
		console.log(this.PROJETOS);
		while(true) {
			const entrada = String(this.pegarInput());
			if (entrada == "m") return;
		}
	}

	static listarProjetosAlocadoConsultor(index: number) {
		console.clear();
		console.log("Projetos alocado: ")
		console.log("(Digite a letra \"m\" para voltar ao menu)");
		console.log(this.CONSULTORES[index].projetos);
		while(true) {
			const entrada = String(this.pegarInput());
			if (entrada == "m") return;
		}
	}

	static listarProjetosAlocadoGerente(index: number) {
		console.clear();
		console.log("Projetos alocado: ")
		console.log("(Digite a letra \"m\" para voltar ao menu)");
		console.log(this.GERENTES[index].projetos);
		while(true) {
			const entrada = String(this.pegarInput());
			if (entrada == "m") return;
		}
	}

	static listarConsultores() {
		console.clear();
		console.log("Lista de consultores: ")
		console.log("(Digite a letra \"m\" para voltar ao menu)");
		for (let i = 0; this.CONSULTORES.length > i; i++) {
			console.log(this.CONSULTORES[i].verDados);
		}
		while(true) {
			const entrada = String(this.pegarInput());
			if (entrada == "m") return;
		}
	}

	static listarConsultor(index: number) {
		console.clear();
		console.log("Seus dados: ")
		console.log("(Digite a letra \"m\" para voltar ao menu)");
		console.log(this.CONSULTORES[index].verDados);

		while(true) {
			const entrada = String(this.pegarInput());
			if (entrada == "m") return;
		}
	}

	static listarGerentes() {
		console.clear();
		console.log("Lista de gerentes: ")
		console.log("(Digite a letra \"m\" para voltar ao menu)");
		for (let i = 0; this.GERENTES.length > i; i++) {
			console.log(this.GERENTES[i].verDados);
		}
		while(true) {
			const entrada = String(this.pegarInput());
			if (entrada == "m") return;
		}
	}

	static listarGerente(index: number) {
		console.clear();
		console.log("Seus dados: ")
		console.log("(Digite a letra \"m\" para voltar ao menu)");
		console.log(this.GERENTES[index].verDados);

		while(true) {
			const entrada = String(this.pegarInput());
			if (entrada == "m") return;
		}
	}

	static fazerLogin() {
		console.clear();
		console.log("Login...")
		console.log("(Digite a letra \"m\" para voltar ao menu)");

		console.log("Nome do usuário: ");
		const nome = String(this.pegarInput());
		if (nome == "m") return;

		console.log("Senha: ");
		const senha = String(this.pegarInput());
		if (nome == "m") return;

		let gerenteEncontrado = false;
		let consultorEncontrado = false;
		for (let i = 0; this.GERENTES.length > i; i++) {
			if (this.GERENTES[i].nome == nome && this.GERENTES[i].pegarSenha == senha) {
				gerenteEncontrado = true;
				this.gerenteLoggedMenu(i);
			}
		}

		for (let i = 0; this.CONSULTORES.length > i; i++) {
			if (this.CONSULTORES[i].nome == nome && this.CONSULTORES[i].pegarSenha == senha) {
				consultorEncontrado = true;
				this.consultorLoggedMenu(i);
			}
		}
		
		if (!gerenteEncontrado && !consultorEncontrado) {
			console.log("Usuário não encontrado, por favor retornar ao menu.");
			while (true) {
				const entrada = String(this.pegarInput());
				if (entrada == "m") return;
			}
		}
	}

	static mostrarGerenteMenu() {
		console.log("Escolha uma opção: ");
		console.log(
			"1. Ver meus dados\n" + 
			"2. Modificar dados\n" + 
			"3. Verificar projetos em que estou alocado\n" +
			"4. Avançar com um projeto\n" + 
			"5. Retirada de consultor\n" +
			"6. Passar projeto para outro gerente\n" +
			"7. Entregar um projeto\n" +
			"8. Fazer logout (voltar para o menu)\n"
		)
	}

	static gerenteLoggedMenu(index: number) {
		let ligado = true;
		while(ligado) {
			console.clear();
			console.log(`Bem vindo ${this.GERENTES[index].nome} ao seu menu: `);
			this.mostrarGerenteMenu();
			switch(this.pegarInput()) {
				case "1":
					this.listarGerente(index);
					break;
				case "2":
					this.modificarGerenteDados(index);
					break;
				case "3":
					this.listarProjetosAlocadoGerente(index);
					break;
				case "4":
					this.avancarProjetoGerente(index);
					break;
				case "5":
					this.retirarConsultor(index);
					break;
				case "6":
					this.passarProjeto(index);
					break;
				case "7":
					this.entregarProjeto();
					break;
				case "8":
					ligado = false;
					console.log("O sistema foi terminado.\n");
					break;
				default:
					continue;
			}
		}
	}

	static mostrarConsultorMenu() {
		console.log("Escolha uma opção: ");
		console.log(
			"1. Ver meus dados\n" + 
			"2. Modificar dados\n" + 
			"3. Verificar projetos em que estou alocado\n" +
			"4. Fazer pedido de avanço de projeto\n" + 
			"5. Fazer pedido de retirada de projeto\n" +
			"6. Fazer logout (voltar para o menu)\n"
		)
	}

	static consultorLoggedMenu(index: number) {
		let ligado = true;
		
		while(ligado) {
			console.clear();
			console.log(`Bem vindo ${this.CONSULTORES[index].nome} ao seu menu: `);
			this.mostrarConsultorMenu();
			switch(this.pegarInput()) {
				case "1":
					this.listarConsultor(index);
					break;
				case "2":
					this.modificarConsultorDados(index);
					break;
				case "3":
					this.listarProjetosAlocadoConsultor(index);
					break;
				case "4":
					this.avancarProjetoConsultor(index);
					break;
				case "5":
					this.pedirRetirada(index);
					break;
				case "6":
					ligado = false;
					break;
				default:
					continue;
			}
		}
	}

	static iniciar() {
		let ligado = true;

		while(ligado) {
			console.clear();
			console.log("O sistema foi iniciado.\n");

			this.mostrarMenu();

			switch(this.pegarInput()) {
				case "1":
					this.criarProjeto();
					break;
				case "2":
					this.removerProjeto();
					break;
				case "3":
					this.criarConsultor();
					break;
				case "4":
					this.removerConsultor();
					break;
				case "5":
					this.criarGerente();
					break;
				case "6":
					this.removerGerente();
					break;
				case "7":
					this.listarProjetos();
					break;
				case "8":
					this.listarConsultores();
					break;
				case "9":
					this.listarGerentes();
					break;
				case "10":
					this.fazerLogin();
					break;
				case "11":
					ligado = false;
					console.log("O sistema foi terminado.\n");
					break;
				default:
					continue;
			}
		}
	}
}

Sistema.iniciar();