# Apostila de Qualidade e Testes — PE_Example

O projeto combina JUnit 5 e Mockito no backend Java, Node Test para testes HTTP e Playwright para E2E.

## 1. Camadas de teste

- **Unitário** (`backend/src/test`): uma classe isolada, rápido e determinístico.
- **Controller/MVC**: rotas, JSON, validação e status com dependências simuladas.
- **API** (`quality/tests/api`): HTTP contra API real e banco.
- **E2E** (`quality/tests/e2e`): navegador atravessando frontend, API e banco.

Testes unitários localizam causas; API e E2E validam integração. Eles complementam revisão, análise estática e testes exploratórios.

## 2. Comandos

```bash
# backend/
mvn test
mvn clean verify

# raiz/
docker compose --profile tests run --rm backend-tests
docker compose up --build -d

# quality/
npm ci
npm run test:api
npx playwright install chromium
npm run test:e2e
npm test
npx playwright test --ui
npx playwright show-report
```

`API_URL` (padrão `http://localhost:8080/api`) e `BASE_URL` (padrão `http://localhost:3000`) configuram endereços. No PowerShell: `$env:API_URL = "http://localhost:8080/api"`.

## 3. JUnit 5 e asserções

O `spring-boot-starter-test` fornece JUnit Jupiter, Mockito e Spring Test. O padrão é Arrange, Act, Assert:

```java
@Test
@DisplayName("Deve rejeitar e-mail duplicado")
void rejeitarEmailDuplicado() {
    when(repository.existsByEmail("maria@senai.br")).thenReturn(true);
    assertThrows(BusinessException.class, () -> service.criar(dto));
    verify(repository, never()).save(any(Usuario.class));
}
```

Anotações: `@Test` marca o teste; `@DisplayName` melhora relatório; `@BeforeEach` prepara cada caso; `@AfterEach` limpa; `@ParameterizedTest` repete com entradas; `@ExtendWith(MockitoExtension.class)` inicializa Mockito.

Asserções frequentes: `assertEquals`, `assertNotNull`, `assertTrue`, `assertFalse`, `assertNull`, `assertThrows` e `assertDoesNotThrow`. Uma asserção deve verificar comportamento observável, não detalhe interno irrelevante.

## 4. Mockito

```java
@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {
    @Mock private UsuarioRepository repository;
    @InjectMocks private UsuarioService service;
}
```

`@Mock` cria um dublê; `@InjectMocks` cria o service e injeta o mock. **Stub** define retorno: `when(repo.findById(99L)).thenReturn(Optional.empty())`. **Verify** confirma interação: `verify(repo, times(1)).save(any(Usuario.class))` ou `verify(repo, never()).save(any())`.

Matchers (`any`, `eq`, `isNull`, `contains`) flexibilizam argumentos. Não misture matcher com literal na mesma chamada sem `eq`. Mocke dependências externas, não o método que está sendo testado.

## 5. Injeção e “decorators”

Em Java, o equivalente a decorators são **anotações**: `@Test`, `@Mock`, `@Valid`, `@Transactional`, `@Service` e `@RestController`. Elas fornecem metadados processados pelo JUnit, Mockito ou Spring por extensões/reflexão; não substituem a lógica do teste.

Formas de injeção:

- **Construtor**: recomendada; dependências obrigatórias e testáveis.
- **Setter**: útil para dependência opcional.
- **Campo**: funciona com `@Autowired`, mas esconde dependências e dificulta testes.

No código de produção, Spring injeta beans (`@Service`, `@Repository`, `@RestController`). No teste, Mockito injeta dublês com `@Mock` e `@InjectMocks`.

## 6. Testes de controller

Use `@WebMvcTest(UsuarioController.class)`, mock do `UsuarioService` e `MockMvc` para simular HTTP sem banco. Verifique status, corpo JSON, validações e chamada ao service. Um controller não deve ser testado apenas pelo retorno Java: o contrato HTTP também importa.

## 7. API com Node Test

`npm run test:api` executa `node --test tests/api/*.test.js`. Os testes usam `fetch` contra a API real:

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';

test('lista usuários', async () => {
  const response = await fetch(`${API_URL}/usuarios?page=0&size=10`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.ok(Array.isArray(body.content));
});
```

`assert.equal` compara valores, `assert.deepEqual` estruturas, `assert.ok` condições e `assert.rejects` falhas assíncronas. Valide status, campos, regras, paginação e efeitos observáveis.

## 8. Playwright e E2E

```javascript
import { test, expect } from '@playwright/test';

test('abre projetos', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /projetos/i }).click();
  await expect(page).toHaveURL(/projetos/);
});
```

Prefira `getByRole`, `getByLabel` e `getByText` a CSS frágil. `expect` aguarda automaticamente `toBeVisible`, `toHaveText` e `toHaveURL`. Use `page.screenshot()` e `show-report` para investigar falhas.

## 9. Boas práticas e pipeline

Cubra caminho feliz, entrada inválida, recurso inexistente, regra de negócio, paginação/pesquisa, status HTTP e integração essencial. Evite dependência de ordem global, horário real e dados deixados por outro teste; use fixtures controladas e identificadores únicos.

`backend-ci.yml` executa `mvn clean verify`; `quality-ci.yml` executa testes HTTP e E2E. Classifique a falha antes de corrigi-la: asserção/cenário (Quality), comportamento de produção (Backend) ou ambiente/pipeline (DevOps). Antes do pull request, execute `mvn clean verify` e `npm test` com a stack disponível e registre evidências.
