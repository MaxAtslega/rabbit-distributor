<?php

namespace App\Util;

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class RpcClient {
    private $connection;
    private $channel;
    private $callback_queue;
    private $response;
    private $corr_id;

    private $exchange = "rabbit-distributor";

    public function __construct()
    {
        $this->connection = new AMQPStreamConnection(
            'localhost',
            5672,
            'guest',
            'guest'
        );
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

    public function onResponse($rep): void
    {
        if ($rep->get('correlation_id') == $this->corr_id) {
            $this->response = $rep->body;
        }
    }

    public function call($n, $routing_key): string
    {
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
