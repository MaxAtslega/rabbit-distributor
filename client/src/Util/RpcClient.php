<?php

namespace App\Util;

use Exception;
use PhpAmqpLib\Channel\AMQPChannel;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class RpcClient {
    private AMQPStreamConnection $connection;
    private AMQPChannel $channel;
    private mixed $callback_queue;
    private mixed $response;
    private string $corr_id;

    private string $exchange = "rabbit-distributor";

    /**
     * @throws Exception
     */
    public function __construct() {
        $rabbitHost = $_ENV['RABBIT_HOST'] ?? "0.0.0.0";
        $rabbitPort = $_ENV['RABBIT_PORT'] ?? 5672;
        $rabbitUser = $_ENV['RABBIT_USER'] ?? "guest";
        $rabbitPassword = $_ENV['RABBIT_PASSWORD'] ?? "guest";
        $this->exchange = $_ENV['RABBIT_EXCHANGE'] ?? "rabbit-distributor";

        $this->connection = new AMQPStreamConnection($rabbitHost, $rabbitPort, $rabbitUser, $rabbitPassword);
        $this->channel = $this->connection->channel();
        $this->channel->exchange_declare($this->exchange, 'topic', false, true, false);

        list($this->callback_queue, ,) = $this->channel->queue_declare(
            "",
            false,
            false,
            true,
            false
        );
        $this->channel->basic_consume(
            $this->callback_queue,
            '',
            false,
            true,
            false,
            false,
            array(
                $this,
                'onResponse'
            )
        );
    }

    public function onResponse($rep): void {
        if ($rep->get('correlation_id') == $this->corr_id) {
            $this->response = $rep->body;
        }
    }

    public function call($n, $routing_key): string {
        $this->response = null;
        $this->corr_id = uniqid();

        $msg = new AMQPMessage(
            (string) $n,
            array(
                'correlation_id' => $this->corr_id,
                'reply_to' => $this->callback_queue
            )
        );
        $this->channel->basic_publish($msg, $this->exchange, $routing_key, false, false);
        while (!$this->response) {
            $this->channel->wait();
        }
        return $this->response;
    }
}
