<?php

namespace App\Entity;

use Symfony\Component\Validator\Constraints as Assert;

class Message {

    #[Assert\NotBlank]
    protected string $message;

    #[Assert\NotBlank]
    protected string $routing_key;

    /**
     * @return string
     */
    public function getMessage(): string
    {
        return $this->message;
    }

    /**
     * @param string $message
     */
    public function setMessage(string $message): void
    {
        $this->message = $message;
    }

    /**
     * @return string
     */
    public function getRoutingKey(): string
    {
        return $this->routing_key;
    }

    /**
     * @param string $routingKey
     */
    public function setRoutingKey(string $routingKey): void
    {
        $this->routing_key = $routingKey;
    }
}