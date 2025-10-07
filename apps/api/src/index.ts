import Fastify from 'fastify';

import { Analyst } from '@spec2app/analyst';
import { Orchestrator } from '@spec2app/orchestrator';

const fastify = Fastify({
  logger: true,
});

const analyst = new Analyst();
const orchestrator = new Orchestrator();

// Health check endpoint
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Analyze specification endpoint
fastify.post<{
  Body: { specification: string };
}>('/api/analyze', async (request, reply) => {
  try {
    const { specification } = request.body;

    if (!specification || typeof specification !== 'string') {
      reply.code(400);
      return { error: 'Specification is required and must be a string' };
    }

    // Step 1: Analyze specification
    const contract = analyst.analyze(specification);

    // Step 2: Validate and normalize
    const result = orchestrator.process(contract);

    if (!result.success) {
      reply.code(400);
      return {
        error: 'Invalid design contract',
        details: result.errors,
      };
    }

    return {
      success: true,
      contract: result.contract,
    };
  } catch (error) {
    request.log.error(error);
    reply.code(500);
    return { error: 'Internal server error' };
  }
});

// Validate design contract endpoint
fastify.post<{
  Body: unknown;
}>('/api/validate', async (request, reply) => {
  try {
    const contract = request.body;

    const result = orchestrator.process(contract);

    if (!result.success) {
      reply.code(400);
      return {
        valid: false,
        errors: result.errors,
      };
    }

    return {
      valid: true,
      contract: result.contract,
    };
  } catch (error) {
    request.log.error(error);
    reply.code(500);
    return { error: 'Internal server error' };
  }
});

// Get design contract info
fastify.get('/api/info', async () => {
  return {
    name: 'Spec2App API',
    version: '0.1.0',
    description: 'Transform natural language specifications into Design Contracts',
    endpoints: [
      {
        method: 'POST',
        path: '/api/analyze',
        description: 'Analyze natural language specification and generate Design Contract',
      },
      {
        method: 'POST',
        path: '/api/validate',
        description: 'Validate and normalize a Design Contract',
      },
      {
        method: 'GET',
        path: '/health',
        description: 'Health check endpoint',
      },
    ],
  };
});

const start = async (): Promise<void> => {
  try {
    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`🚀 Server is running on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

