import { NextRequest, NextResponse } from 'next/server';
import { getTodoRepository } from '@/lib/database';

interface RouteParams {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const repo = await getTodoRepository();
    const todo = await repo.findOneBy({ id });

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    const body = await request.json();

    if (typeof body.completed === 'boolean') {
      todo.completed = body.completed;
    }
    if (typeof body.title === 'string' && body.title.trim().length > 0) {
      todo.title = body.title.trim();
    }
    if (body.description !== undefined) {
      todo.description = body.description ? body.description.trim() : null;
    }

    const updated = await repo.save(todo);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH /api/todos/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const repo = await getTodoRepository();
    const todo = await repo.findOneBy({ id });

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    await repo.remove(todo);
    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/todos/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
