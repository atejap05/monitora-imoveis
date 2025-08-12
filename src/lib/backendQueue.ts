/**
 * Backend Queue Manager
 *
 * Gerencia a fila de requisições para o backend Python que executa
 * funções sequencialmente (não paralelo). Evita sobrecarga e timeouts.
 */
class BackendQueueManager {
  private queue: Array<() => Promise<any>> = [];
  private maxConcurrent = 1; // Backend Python roda sequencial
  private currentTasks = 0;

  /**
   * Adiciona uma requisição à fila de execução
   */
  async addToQueue<T>(
    fn: () => Promise<T>,
    priority: "low" | "normal" | "high" = "normal"
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const task = async () => {
        try {
          this.currentTasks++;
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.currentTasks--;
          this.processNext();
        }
      };

      // Prioridade alta vai para o início da fila
      if (priority === "high") {
        this.queue.unshift(task);
      } else {
        this.queue.push(task);
      }

      this.processNext();
    });
  }

  /**
   * Processa próxima tarefa na fila
   */
  private processNext() {
    if (this.currentTasks >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift();
    if (task) {
      task();
    }
  }

  /**
   * Limpa a fila (útil para cancelar requisições pendentes)
   */
  clearQueue() {
    this.queue.length = 0;
  }

  /**
   * Retorna status da fila
   */
  getQueueStatus() {
    return {
      queueLength: this.queue.length,
      isProcessing: this.currentTasks > 0,
      currentTasks: this.currentTasks,
    };
  }
}

// Instância singleton do queue manager
export const backendQueue = new BackendQueueManager();

/**
 * Wrapper para requisições ao backend que usa o queue manager
 */
export const queuedBackendCall = <T>(
  fn: () => Promise<T>,
  priority: "low" | "normal" | "high" = "normal"
): Promise<T> => {
  return backendQueue.addToQueue(fn, priority);
};

/**
 * Hook para monitorar status da fila (opcional para debug/UI)
 */
export const useBackendQueueStatus = () => {
  return backendQueue.getQueueStatus();
};
