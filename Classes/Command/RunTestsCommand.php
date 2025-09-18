<?php

namespace Toumoro\TmQaTools\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Process\Process;

#[AsCommand(
    name: 'tmqatools:run',
    description: 'A command that runs all functional tests.'
)]
class RunTestsCommand extends Command
{
    private const COMMAND = './Build/Scripts/runTests.sh functional:all';

    /**
     * Defines the allowed options for this command
     */
    protected function configure(): void
    {
        $this
            ->setDescription('Enter the command that you want to execute')
            ->addArgument(
                'execCmd',
                InputArgument::OPTIONAL,
                'Executable Command',
                self::COMMAND
            );
    }

    /**
     * @param InputInterface  $input
     * @param OutputInterface $output
     *
     * @return int
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Executing script in progress');

        $command = $input->getArgument('execCmd');

        $process = Process::fromShellCommandline($command);
        $process->run(function ($type, $buffer) use ($io) {
            $io->write($buffer);
        });

        if (!$process->isSuccessful()) {
            $io->error('Script failed.');
            return Command::FAILURE;
        }

        $io->success('Script completed successfully.');
        return Command::SUCCESS;
    }
}
