import { SkillStore, SkillExecutor, GeneratePaletteSkill, GenerateTypographySkill, MatchVibeSkill, DetectComplexitySkill } from '@designsys/ui-ux-skills';

async function main() {
    console.log('🚀 Starting Skills Verification...');

    // 1. Initialize System
    const store = new SkillStore();
    const executor = new SkillExecutor(store);
    const registry = executor.getRegistry();

    console.log('✅ Core Infrastructure Initialized');

    // 2. Register Skills
    registry.register(new GeneratePaletteSkill());
    registry.register(new GenerateTypographySkill());
    registry.register(new MatchVibeSkill());
    registry.register(new DetectComplexitySkill());

    console.log(`✅ Registered ${registry.getAll().length} skills`);

    // 3. Execute Color Skill
    console.log('\n🎨 Testing Color Skill...');
    const colorResult = await executor.execute('color.generate-palette', {
        baseColor: '#6366f1',
        mood: 'creative'
    });

    if (colorResult.status === 'success') {
        console.log('✅ Color Palette Generated:', colorResult.output.cssVariables['--color-secondary']);
    } else {
        console.error('❌ Color Skill Failed:', colorResult.error);
    }

    // 4. Execute Style Skill (BM25)
    console.log('\n✨ Testing Style Skill (BM25)...');
    const styleResult = await executor.execute('style.match-vibe', {
        description: 'A clean and modern tech startup website with dark mode',
        industry: 'Technology'
    });

    if (styleResult.status === 'success') {
        console.log('✅ Vibe Matches:', styleResult.output.map((r: any) => `${r.name} (${r.score.toFixed(2)})`).join(', '));
    } else {
        console.error('❌ Style Skill Failed:', styleResult.error);
    }

    // 5. Execute Component Skill
    console.log('\n🧩 Testing Component Skill...');
    const componentCode = `
    const MyComponent = () => {
      const [state, setState] = useState();
      useEffect(() => {}, []);
      return <div>{state ? 'Yes' : 'No'}</div>;
    }
  `;
    const compResult = await executor.execute('component.detect-complexity', {
        componentCode
    });

    if (compResult.status === 'success') {
        console.log('✅ Complexity Detected:', compResult.output);
    } else {
        console.error('❌ Component Skill Failed:', compResult.error);
    }

    // 6. Check History
    const history = store.getExecutionHistory();
    console.log(`\n📜 Execution History: ${history.length} entries stored.`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
