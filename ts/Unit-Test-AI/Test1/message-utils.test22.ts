import { getBaseMessageTemplates } from '../src/utils/message-utils';

// !!! 这是关于 getBaseMessageTemplates 的单元测试
describe('getBaseMessageTemplates', () => {
  it('should return an array of BaseMessagePromptTemplate', async () => {
    // !!! Arrange
    const prefixMessages = [
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ];

    // !!! Action
    const result = await getBaseMessageTemplates(prefixMessages);

    // !!! Assert
    expect(result).toEqual([
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ]);
  });

  it('should return an empty array when prefixMessages is not provided', async () => {
    // Action
    const result = await getBaseMessageTemplates();

    // Assert
    expect(result).toEqual([]);
  });
});

// 这是关于 getBaseMessageTemplates 的单元测试
describe('getBaseMessageTemplates', () => {
  it('should return an array of BaseMessagePromptTemplate', async () => {
    // Arrange
    const prefixMessages = [
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ];

    // Action
    const result = await getBaseMessageTemplates(prefixMessages);

    // Assert
    expect(result).toEqual([
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ]);
  });

  it('should return an empty array when prefixMessages is not provided', async () => {
    // Action
    const result = await getBaseMessageTemplates();

    // Assert
    expect(result).toEqual([]);
  });
});

// 这是关于 getBaseMessageTemplates 的单元测试
describe('getBaseMessageTemplates', () => {
  it('should return an array of BaseMessagePromptTemplate', async () => {
    // Arrange
    const prefixMessages = [
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ];

    // Action
    const result = await getBaseMessageTemplates(prefixMessages);

    // Assert
    expect(result).toEqual([
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ]);
  });

  it('should return an empty array when prefixMessages is not provided', async () => {
    // Action
    const result = await getBaseMessageTemplates();

    // Assert
    expect(result).toEqual([]);
  });
});
// 这是关于 getBaseMessageTemplates 的单元测试
describe('getBaseMessageTemplates', () => {
  it('should return an array of BaseMessagePromptTemplate', async () => {
    // Arrange
    const prefixMessages = [
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ];

    // Action
    const result = await getBaseMessageTemplates(prefixMessages);

    // Assert
    expect(result).toEqual([
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ]);
  });

  it('should return an empty array when prefixMessages is not provided', async () => {
    // Action
    const result = await getBaseMessageTemplates();

    // Assert
    expect(result).toEqual([]);
  });
});
// 这是关于 getBaseMessageTemplates 的单元测试
describe('getBaseMessageTemplates', () => {
  it('should return an array of BaseMessagePromptTemplate', async () => {
    // Arrange
    const prefixMessages = [
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ];

    // Action
    const result = await getBaseMessageTemplates(prefixMessages);

    // Assert
    expect(result).toEqual([
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ]);
  });

  it('should return an empty array when prefixMessages is not provided', async () => {
    // Action
    const result = await getBaseMessageTemplates();

    // Assert
    expect(result).toEqual([]);
  });
});
// 这是关于 getBaseMessageTemplates 的单元测试
describe('getBaseMessageTemplates', () => {
  it('should return an array of BaseMessagePromptTemplate', async () => {
    // Arrange
    const prefixMessages = [
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ];

    // Action
    const result = await getBaseMessageTemplates(prefixMessages);

    // Assert
    expect(result).toEqual([
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ]);
  });

  it('should return an empty array when prefixMessages is not provided', async () => {
    // Action
    const result = await getBaseMessageTemplates();

    // Assert
    expect(result).toEqual([]);
  });
});
// 这是关于 getBaseMessageTemplates 的单元测试
describe('getBaseMessageTemplates', () => {
  it('should return an array of BaseMessagePromptTemplate', async () => {
    // Arrange
    const prefixMessages = [
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ];

    // Action
    const result = await getBaseMessageTemplates(prefixMessages);

    // Assert
    expect(result).toEqual([
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ]);
  });

  it('should return an empty array when prefixMessages is not provided', async () => {
    // Action
    const result = await getBaseMessageTemplates();

    // Assert
    expect(result).toEqual([]);
  });
});
// 这是关于 getBaseMessageTemplates 的单元测试
describe('getBaseMessageTemplates', () => {
  it('should return an array of BaseMessagePromptTemplate', async () => {
    // Arrange
    const prefixMessages = [
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ];

    // Action
    const result = await getBaseMessageTemplates(prefixMessages);

    // Assert
    expect(result).toEqual([
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ]);
  });

  it('should return an empty array when prefixMessages is not provided', async () => {
    // Action
    const result = await getBaseMessageTemplates();

    // Assert
    expect(result).toEqual([]);
  });
});
// 这是关于 getBaseMessageTemplates 的单元测试
describe('getBaseMessageTemplates', () => {
  it('should return an array of BaseMessagePromptTemplate', async () => {
    // Arrange
    const prefixMessages = [
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ];

    // Action
    const result = await getBaseMessageTemplates(prefixMessages);

    // Assert
    expect(result).toEqual([
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ]);
  });

  it('should return an empty array when prefixMessages is not provided', async () => {
    // Action
    const result = await getBaseMessageTemplates();

    // Assert
    expect(result).toEqual([]);
  });
});
// 这是关于 getBaseMessageTemplates 的单元测试
describe('getBaseMessageTemplates', () => {
  it('should return an array of BaseMessagePromptTemplate', async () => {
    // Arrange
    const prefixMessages = [
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ];

    // Action
    const result = await getBaseMessageTemplates(prefixMessages);

    // Assert
    expect(result).toEqual([
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ]);
  });

  it('should return an empty array when prefixMessages is not provided', async () => {
    // Action
    const result = await getBaseMessageTemplates();

    // Assert
    expect(result).toEqual([]);
  });
});
// 这是关于 getBaseMessageTemplates 的单元测试
describe('getBaseMessageTemplates', () => {
  it('should return an array of BaseMessagePromptTemplate', async () => {
    // Arrange
    const prefixMessages = [
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ];

    // Action
    const result = await getBaseMessageTemplates(prefixMessages);

    // Assert
    expect(result).toEqual([
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ]);
  });

  it('should return an empty array when prefixMessages is not provided', async () => {
    // Action
    const result = await getBaseMessageTemplates();

    // Assert
    expect(result).toEqual([]);
  });
});
// 这是关于 getBaseMessageTemplates 的单元测试
describe('getBaseMessageTemplates', () => {
  it('should return an array of BaseMessagePromptTemplate', async () => {
    // Arrange
    const prefixMessages = [
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ];

    // Action
    const result = await getBaseMessageTemplates(prefixMessages);

    // Assert
    expect(result).toEqual([
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ]);
  });

  it('should return an empty array when prefixMessages is not provided', async () => {
    // Action
    const result = await getBaseMessageTemplates();

    // Assert
    expect(result).toEqual([]);
  });
});
// 这是关于 getBaseMessageTemplates 的单元测试
describe('getBaseMessageTemplates', () => {
  it('should return an array of BaseMessagePromptTemplate', async () => {
    // Arrange
    const prefixMessages = [
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ];

    // Action
    const result = await getBaseMessageTemplates(prefixMessages);

    // Assert
    expect(result).toEqual([
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ]);
  });

  it('should return an empty array when prefixMessages is not provided', async () => {
    // Action
    const result = await getBaseMessageTemplates();

    // Assert
    expect(result).toEqual([]);
  });
});
// 这是关于 getBaseMessageTemplates 的单元测试
describe('getBaseMessageTemplates', () => {
  it('should return an array of BaseMessagePromptTemplate', async () => {
    // Arrange
    const prefixMessages = [
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ];

    // Action
    const result = await getBaseMessageTemplates(prefixMessages);

    // Assert
    expect(result).toEqual([
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ]);
  });

  it('should return an empty array when prefixMessages is not provided', async () => {
    // Action
    const result = await getBaseMessageTemplates();

    // Assert
    expect(result).toEqual([]);
  });
});
// 这是关于 getBaseMessageTemplates 的单元测试
describe('getBaseMessageTemplates', () => {
  it('should return an array of BaseMessagePromptTemplate', async () => {
    // Arrange
    const prefixMessages = [
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ];

    // Action
    const result = await getBaseMessageTemplates(prefixMessages);

    // Assert
    expect(result).toEqual([
      { id: 1, content: 'Hello' },
      { id: 2, content: 'World' },
    ]);
  });

  it('should return an empty array when prefixMessages is not provided', async () => {
    // Action
    const result = await getBaseMessageTemplates();

    // Assert
    expect(result).toEqual([]);
  });
});
