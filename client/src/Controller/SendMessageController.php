<?php

namespace App\Controller;

use App\Entity\Message;
use App\Form\MessageType;
use App\Util\RpcClient;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class SendMessageController extends AbstractController {

    #[Route('/send', name: 'send_message', methods: ['POST'])]
    public function send(Request $request): JsonResponse {
        $message = new Message();
        $data = json_decode($request->getContent(), true);

        $form = $this->createForm(MessageType::class, $message);
        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {

            // Send message to Rabbit server
            $rpcClient = new RpcClient();
            $response = $rpcClient->call($message->getMessage(), $message->getRoutingKey());

            return new JsonResponse(['message' => 'Your response is: '. $response]);
        }

        return new JsonResponse([
            'error' => 'Bad Request',
            'message' => 'The request is invalid. Please provide both the \'message\' and \'routing_key\' in the request body.'
        ], Response::HTTP_BAD_REQUEST);
    }
}